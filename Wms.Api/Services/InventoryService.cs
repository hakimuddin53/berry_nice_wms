using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Entities;
using Wms.Api.Model;

namespace Wms.Api.Services
{
	public class InventoryService : IInventoryService
	{
		private readonly ApplicationDbContext _context;

		public InventoryService(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task StockInAsync(StockIn stockIn)
		{
			ArgumentNullException.ThrowIfNull(stockIn);

			if (stockIn.StockInItems is null || stockIn.StockInItems.Count == 0)
			{
				await _context.SaveChangesAsync();
				return;
			}

			await using var transaction = await _context.Database.BeginTransactionAsync();

			try
			{
				var balanceCache = new Dictionary<(Guid ProductId, Guid WarehouseId, Guid LocationId), int>();

				var productIds = stockIn.StockInItems
					.Select(i => i.ProductId)
					.Where(id => id != Guid.Empty)
					.Distinct()
					.ToList();

				var productCostMap = productIds.Count == 0
					? new Dictionary<Guid, decimal?>()
					: await _context.Products
						.Where(p => productIds.Contains(p.ProductId))
						.Select(p => new { p.ProductId, p.CostPrice })
						.ToDictionaryAsync(p => p.ProductId, p => p.CostPrice);

				foreach (var entry in _context.ChangeTracker.Entries<Product>().Where(e => e.Entity != null))
				{
					var product = entry.Entity;
					productCostMap[product.ProductId] = product.CostPrice;
				}

				// Remarks are now simple strings per item; no lookup table required.

				foreach (var item in stockIn.StockInItems)
				{
					if (item.ProductId == Guid.Empty)
					{
						throw new InvalidOperationException("Product reference is required for inventory transactions.");
					}

					var key = (ProductId: item.ProductId, WarehouseId: stockIn.WarehouseId, LocationId: item.LocationId);
					if (!balanceCache.TryGetValue(key, out var oldBalance))
					{
						oldBalance = await GetCurrentBalanceAsync(key.ProductId, key.WarehouseId, key.LocationId);
					}

					var newBalance = checked(oldBalance + item.ReceiveQuantity);
					balanceCache[key] = newBalance;

					var inventoryRecord = new Inventory
					{
						Id = Guid.NewGuid(),
						TransactionType = TransactionTypeEnum.STOCKIN,
						ProductId = key.ProductId,
						WarehouseId = key.WarehouseId,
						CurrentLocationId = key.LocationId,
						StockInId = stockIn.Id,
						StockTransferId = Guid.Empty,
						StockAdjustmentId = Guid.Empty,
						QuantityIn = item.ReceiveQuantity,
						QuantityOut = 0,
						OldBalance = oldBalance,
						NewBalance = newBalance,
						UnitPrice = productCostMap.TryGetValue(item.ProductId, out var unitCost) ? unitCost ?? 0 : 0,
						Remark = item.Remark
					};

					_context.Inventories.Add(inventoryRecord);
				}

				await _context.SaveChangesAsync();
				await transaction.CommitAsync();
			}
			catch
			{
				await transaction.RollbackAsync();
				throw;
			}
		}



		private async Task<int> GetCurrentBalanceAsync(Guid productId, Guid warehouseId, Guid locationId)
		{
			var latestRecord = await _context.Inventories
				.Where(i => i.ProductId == productId &&
							i.WarehouseId == warehouseId &&
							i.CurrentLocationId == locationId)
				.OrderByDescending(i => i.CreatedAt)
				.ThenByDescending(i => i.Id)
				.FirstOrDefaultAsync();

			return latestRecord?.NewBalance ?? 0;
		}
	}
}
