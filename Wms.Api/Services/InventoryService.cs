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
				var balanceCache = new Dictionary<(Guid ProductId, Guid WarehouseId), int>();

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

				var warehouseId = stockIn.WarehouseId;

				// Process stock-in items
				var inventoryRecords = new List<Inventory>();

				// Group by product to combine quantities for the same product
				var productGroups = stockIn.StockInItems
					.GroupBy(i => i.ProductId)
					.ToList();

				foreach (var productGroup in productGroups)
				{
					var productId = productGroup.Key;
					var totalQuantity = productGroup.Sum(i => i.ReceiveQuantity);

					var key = (ProductId: productId, WarehouseId: warehouseId);

					if (!balanceCache.TryGetValue(key, out var oldBalance))
					{
						oldBalance = await GetCurrentBalanceAsync(productId, warehouseId);
					}

					var newBalance = checked(oldBalance + totalQuantity);
					balanceCache[key] = newBalance;

					var inventoryRecord = new Inventory
					{
						Id = Guid.NewGuid(),
						TransactionType = TransactionTypeEnum.STOCKIN,
						ProductId = productId,
						WarehouseId = warehouseId,
						StockInId = stockIn.Id,
						StockTransferId = Guid.Empty,
						StockAdjustmentId = null,
						InvoiceId = null,
						QuantityIn = totalQuantity,
						QuantityOut = 0,
						OldBalance = oldBalance,
						NewBalance = newBalance,
						UnitPrice = productCostMap.TryGetValue(productId, out var unitCost) ? unitCost ?? 0 : 0,
						Remark = "Stock In Transaction"
					};

					inventoryRecords.Add(inventoryRecord);
				}

				_context.Inventories.AddRange(inventoryRecords);

				await _context.SaveChangesAsync();
				await transaction.CommitAsync();
			}
			catch
			{
				await transaction.RollbackAsync();
				throw;
			}
		}

		private async Task<int> GetCurrentBalanceAsync(Guid productId, Guid warehouseId)
		{
			var latestRecord = await _context.Inventories
				.Where(i => i.ProductId == productId && i.WarehouseId == warehouseId)
				.OrderByDescending(i => i.CreatedAt)
				.ThenByDescending(i => i.Id)
				.FirstOrDefaultAsync();

			return latestRecord?.NewBalance ?? 0;
		}

		public async Task StockOutAsync(Invoice invoice)
		{
			ArgumentNullException.ThrowIfNull(invoice);

			if (invoice.InvoiceItems is null || invoice.InvoiceItems.Count == 0)
			{
				await _context.SaveChangesAsync();
				return;
			}

			await using var transaction = await _context.Database.BeginTransactionAsync();

			try
			{
				// Get warehouse ID from invoice (assume it's available)
				var warehouseId = GetInvoiceWarehouseId(invoice); // Implement this method

				var balanceCache = new Dictionary<(Guid ProductId, Guid WarehouseId), int>();

				var productIds = invoice.InvoiceItems
					.Where(i => i.ProductId.HasValue && i.ProductId.Value != Guid.Empty)
					.Select(i => i.ProductId!.Value)
					.Where(id => id != Guid.Empty)
					.Distinct()
					.ToList();

				var productCostMap = productIds.Count == 0
					? new Dictionary<Guid, decimal?>()
					: await _context.Products
						.Where(p => productIds.Contains(p.ProductId))
						.Select(p => new { p.ProductId, p.CostPrice })
						.ToDictionaryAsync(p => p.ProductId, p => p.CostPrice);

				// Group invoice items by product to combine quantities for the same product
				var productGroups = invoice.InvoiceItems
					.Where(i => i.ProductId.HasValue && i.ProductId.Value != Guid.Empty)
					.GroupBy(i => i.ProductId!.Value)
					.ToList();

				// Process each unique product in the invoice
				var inventoryRecords = new List<Inventory>();

				var processedProducts = new HashSet<Guid>();

				foreach (var productGroup in productGroups)
				{
					var productId = productGroup.Key;
					var totalQuantity = productGroup.Sum(i => i.Quantity);

					var key = (ProductId: productId, WarehouseId: warehouseId);

					if (!balanceCache.TryGetValue(key, out var oldBalance))
					{
						oldBalance = await GetCurrentBalanceAsync(productId, warehouseId);
					}

					var newBalance = checked(oldBalance - totalQuantity);
					balanceCache[key] = newBalance;

					var inventoryRecord = new Inventory
					{
						Id = Guid.NewGuid(),
						TransactionType = TransactionTypeEnum.STOCKADJUSTMENT,
						ProductId = productId,
						WarehouseId = warehouseId,
						StockInId = Guid.Empty,
						StockTransferId = Guid.Empty,
						StockAdjustmentId = null,
						InvoiceId = invoice.Id, // Set invoice reference
						QuantityIn = 0,
						QuantityOut = totalQuantity,
						OldBalance = oldBalance,
						NewBalance = newBalance,
						UnitPrice = productCostMap.TryGetValue(productId, out var unitCost) ? unitCost ?? 0 : 0,
						Remark = $"Invoice: {invoice.Number}"
					};

					inventoryRecords.Add(inventoryRecord);
				}

				// Add all inventory records to context
				_context.Inventories.AddRange(inventoryRecords);

				await _context.SaveChangesAsync();
				await transaction.CommitAsync();
			}
			catch
			{
				await transaction.RollbackAsync();
				throw;
			}
		}

		private Guid GetInvoiceWarehouseId(Invoice invoice)
		{
			var defaultWarehouseId = Guid.Parse("00000000-0000-0000-0000-000000000001");

			return invoice.WarehouseId ?? defaultWarehouseId;
		}
	}
}
