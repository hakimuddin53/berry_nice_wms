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

                var productCodeLookup = stockIn.StockInItems
                    .Select(i => i.ProductCode?.Trim())
                    .Where(code => !string.IsNullOrWhiteSpace(code))
                    .Distinct(System.StringComparer.OrdinalIgnoreCase)
                    .ToList();

                var productCodeSet = new HashSet<string>(productCodeLookup, System.StringComparer.OrdinalIgnoreCase);

                if (productCodeLookup.Count == 0)
                {
                    throw new InvalidOperationException("Each stock-in item must include a product code.");
                }

                var productIdsByCode = await _context.Products
                    .Where(p => productCodeLookup.Contains(p.ProductCode))
                    .Select(p => new { p.ProductCode, p.ProductId })
                    .ToDictionaryAsync(
                        p => p.ProductCode,
                        p => p.ProductId,
                        System.StringComparer.OrdinalIgnoreCase);

                var newProducts = _context.ChangeTracker
                    .Entries<Product>()
                    .Where(e => e.State == EntityState.Added && e.Entity.ProductCode != null)
                    .Select(e => e.Entity)
                    .Where(p => productCodeSet.Contains(p.ProductCode))
                    .ToList();

                foreach (var product in newProducts)
                {
                    productIdsByCode[product.ProductCode] = product.ProductId;
                }

				foreach (var item in stockIn.StockInItems)
				{
                    if (string.IsNullOrWhiteSpace(item.ProductCode))
                    {
                        throw new InvalidOperationException("Product code is required for inventory transactions.");
                    }

                    var normalizedCode = item.ProductCode.Trim();

                    if (!productIdsByCode.TryGetValue(normalizedCode, out var productId))
                    {
                        throw new InvalidOperationException($"Product code '{item.ProductCode}' does not exist.");
                    }

					var key = (ProductId: productId, WarehouseId: stockIn.WarehouseId, LocationId: item.LocationId);
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
						StockOutId = Guid.Empty,
						StockTransferId = Guid.Empty,
						StockAdjustmentId = Guid.Empty,
						QuantityIn = item.ReceiveQuantity,
						QuantityOut = 0,
						OldBalance = oldBalance,
						NewBalance = newBalance,
						UnitPrice = item.Cost ?? 0,
						Remark = item.StockInItemRemarks?.FirstOrDefault()?.Remark
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

		public async Task StockOutAsync(StockOut stockOut)
		{
			ArgumentNullException.ThrowIfNull(stockOut);

			if (stockOut.StockOutItems is null || stockOut.StockOutItems.Count == 0)
			{
				await _context.SaveChangesAsync();
				return;
			}

			await using var transaction = await _context.Database.BeginTransactionAsync();

			try
			{
				var balanceCache = new Dictionary<(Guid ProductId, Guid WarehouseId, Guid LocationId), int>();

				foreach (var item in stockOut.StockOutItems)
				{
					var key = (ProductId: item.ProductId, WarehouseId: stockOut.WarehouseId, LocationId: item.LocationId);
					if (!balanceCache.TryGetValue(key, out var oldBalance))
					{
						oldBalance = await GetCurrentBalanceAsync(key.ProductId, key.WarehouseId, key.LocationId);
					}

					if (oldBalance < item.Quantity)
					{
						throw new InvalidOperationException(
							$"Insufficient stock for product {item.ProductId}. Required: {item.Quantity}, Available: {oldBalance}.");
					}

					var newBalance = oldBalance - item.Quantity;
					balanceCache[key] = newBalance;

					var inventoryRecord = new Inventory
					{
						Id = Guid.NewGuid(),
						TransactionType = TransactionTypeEnum.STOCKOUT,
						ProductId = key.ProductId,
						WarehouseId = key.WarehouseId,
						CurrentLocationId = key.LocationId,
						StockInId = Guid.Empty,
						StockOutId = stockOut.Id,
						StockTransferId = Guid.Empty,
						StockAdjustmentId = Guid.Empty,
						QuantityIn = 0,
						QuantityOut = item.Quantity,
						OldBalance = oldBalance,
						NewBalance = newBalance,
						UnitPrice = 0,
						Remark = null
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

		public async Task CancelStockOutAsync(Guid stockOutId)
		{
			await using var transaction = await _context.Database.BeginTransactionAsync();

			try
			{
				var stockOut = await _context.StockOuts
					.Include(s => s.StockOutItems)
					.SingleOrDefaultAsync(s => s.Id == stockOutId);

				if (stockOut is null)
				{
					throw new KeyNotFoundException($"Stock out {stockOutId} not found.");
				}

				var balanceCache = new Dictionary<(Guid ProductId, Guid WarehouseId, Guid LocationId), int>();

				foreach (var item in stockOut.StockOutItems ?? Enumerable.Empty<StockOutItem>())
				{
					var key = (ProductId: item.ProductId, WarehouseId: stockOut.WarehouseId, LocationId: item.LocationId);
					if (!balanceCache.TryGetValue(key, out var oldBalance))
					{
						oldBalance = await GetCurrentBalanceAsync(key.ProductId, key.WarehouseId, key.LocationId);
					}

					var newBalance = checked(oldBalance + item.Quantity);
					balanceCache[key] = newBalance;

					var inventoryRecord = new Inventory
					{
						Id = Guid.NewGuid(),
						TransactionType = TransactionTypeEnum.STOCKOUTCANCEL,
						ProductId = key.ProductId,
						WarehouseId = key.WarehouseId,
						CurrentLocationId = key.LocationId,
						StockInId = Guid.Empty,
						StockOutId = stockOut.Id,
						StockTransferId = Guid.Empty,
						StockAdjustmentId = Guid.Empty,
						QuantityIn = item.Quantity,
						QuantityOut = 0,
						OldBalance = oldBalance,
						NewBalance = newBalance,
						UnitPrice = 0,
						Remark = "Cancellation adjustment"
					};

					_context.Inventories.Add(inventoryRecord);
				}

				stockOut.Status = StockOutStatusEnum.CANCELLED;

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
