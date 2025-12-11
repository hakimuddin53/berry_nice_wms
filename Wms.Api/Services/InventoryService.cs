using System;
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

		public async Task StockTransferAsync(StockTransferRequest request)
		{
			ArgumentNullException.ThrowIfNull(request);
			if (request.FromWarehouseId == Guid.Empty || request.ToWarehouseId == Guid.Empty)
			{
				throw new ArgumentException("Both source and destination warehouses are required.");
			}

			if (request.FromWarehouseId == request.ToWarehouseId)
			{
				throw new ArgumentException("Source and destination warehouses must be different.");
			}

			if (request.Items == null || request.Items.Count == 0)
			{
				throw new ArgumentException("At least one transfer item is required.");
			}

			await using var transaction = await _context.Database.BeginTransactionAsync();

			try
			{
				var stockTransferId = Guid.NewGuid();
				var balanceCache = new Dictionary<(Guid ProductId, Guid WarehouseId), int>();

				var productIds = request.Items
					.Where(i => i.ProductId != Guid.Empty)
					.Select(i => i.ProductId)
					.Distinct()
					.ToList();

				var productCostMap = productIds.Count == 0
					? new Dictionary<Guid, decimal?>()
					: await _context.Products
						.Where(p => productIds.Contains(p.ProductId))
						.Select(p => new { p.ProductId, p.CostPrice })
						.ToDictionaryAsync(p => p.ProductId, p => p.CostPrice);

				var groupedItems = request.Items
					.Where(i => i.ProductId != Guid.Empty && i.Quantity > 0)
					.GroupBy(i => i.ProductId)
					.ToList();

				var inventoryRecords = new List<Inventory>();

				foreach (var group in groupedItems)
				{
					var productId = group.Key;
					var totalQuantity = group.Sum(i => i.Quantity);

					var fromKey = (ProductId: productId, WarehouseId: request.FromWarehouseId);
					var toKey = (ProductId: productId, WarehouseId: request.ToWarehouseId);

					if (!balanceCache.TryGetValue(fromKey, out var fromOldBalance))
					{
						fromOldBalance = await GetCurrentBalanceAsync(productId, request.FromWarehouseId);
					}

					var fromNewBalance = checked(fromOldBalance - totalQuantity);
					balanceCache[fromKey] = fromNewBalance;

					var unitCost = productCostMap.TryGetValue(productId, out var cost) ? cost ?? 0 : 0;

					inventoryRecords.Add(new Inventory
					{
						Id = Guid.NewGuid(),
						TransactionType = TransactionTypeEnum.STOCKTRANSFEROUT,
						ProductId = productId,
						WarehouseId = request.FromWarehouseId,
						StockRecieveId = Guid.Empty,
						StockTransferId = stockTransferId, 
						InvoiceId = null,
						QuantityIn = 0,
						QuantityOut = totalQuantity,
						OldBalance = fromOldBalance,
						NewBalance = fromNewBalance,
						UnitPrice = unitCost,
						Remark = group.FirstOrDefault()?.Remark ?? "Stock Transfer Out"
					});

					if (!balanceCache.TryGetValue(toKey, out var toOldBalance))
					{
						toOldBalance = await GetCurrentBalanceAsync(productId, request.ToWarehouseId);
					}

					var toNewBalance = checked(toOldBalance + totalQuantity);
					balanceCache[toKey] = toNewBalance;

					inventoryRecords.Add(new Inventory
					{
						Id = Guid.NewGuid(),
						TransactionType = TransactionTypeEnum.STOCKTRANSFERIN,
						ProductId = productId,
						WarehouseId = request.ToWarehouseId,
						StockRecieveId = Guid.Empty,
						StockTransferId = stockTransferId, 
						InvoiceId = null,
						QuantityIn = totalQuantity,
						QuantityOut = 0,
						OldBalance = toOldBalance,
						NewBalance = toNewBalance,
						UnitPrice = unitCost,
						Remark = group.FirstOrDefault()?.Remark ?? "Stock Transfer In"
					});
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

		public async Task StockRecieveAsync(StockRecieve StockRecieve)
		{
			ArgumentNullException.ThrowIfNull(StockRecieve);

			if (StockRecieve.StockRecieveItems is null || StockRecieve.StockRecieveItems.Count == 0)
			{
				await _context.SaveChangesAsync();
				return;
			}

			await using var transaction = await _context.Database.BeginTransactionAsync();

			try
			{
				var balanceCache = new Dictionary<(Guid ProductId, Guid WarehouseId), int>();

				var productIds = StockRecieve.StockRecieveItems
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

				var warehouseId = StockRecieve.WarehouseId;

				// Process stock-receive items
				var inventoryRecords = new List<Inventory>();

				// Group by product to combine quantities for the same product
				var productGroups = StockRecieve.StockRecieveItems
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
						TransactionType = TransactionTypeEnum.STOCKRECEIVE,
						ProductId = productId,
						WarehouseId = warehouseId,
						StockRecieveId = StockRecieve.Id,
						StockTransferId = Guid.Empty, 
						InvoiceId = null,
						QuantityIn = totalQuantity,
						QuantityOut = 0,
						OldBalance = oldBalance,
						NewBalance = newBalance,
						UnitPrice = productCostMap.TryGetValue(productId, out var unitCost) ? unitCost ?? 0 : 0,
						Remark = "Stock Receive Transaction"
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

		public async Task InvoiceAsync(Invoice invoice)
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
				var warehouseId = GetInvoiceWarehouseId(invoice);

				var balanceCache = new Dictionary<(Guid ProductId, Guid WarehouseId), int>();

				var productIds = invoice.InvoiceItems
					.Where(i => i.ProductId.HasValue && i.ProductId.Value != Guid.Empty)
					.Select(i => i.ProductId!.Value)
					.Distinct()
					.ToList();

				var productCostMap = productIds.Count == 0
					? new Dictionary<Guid, decimal?>()
					: await _context.Products
						.Where(p => productIds.Contains(p.ProductId))
						.Select(p => new { p.ProductId, p.CostPrice })
						.ToDictionaryAsync(p => p.ProductId, p => p.CostPrice);

				var productGroups = invoice.InvoiceItems
					.Where(i => i.ProductId.HasValue && i.ProductId.Value != Guid.Empty)
					.GroupBy(i => i.ProductId!.Value)
					.ToList();

				var inventoryRecords = new List<Inventory>();

				foreach (var productGroup in productGroups)
				{
					var productId = productGroup.Key;
					var totalQuantity = productGroup.Sum(i => i.Quantity);

					if (totalQuantity <= 0)
					{
						continue;
					}

					var key = (ProductId: productId, WarehouseId: warehouseId);

					if (!balanceCache.TryGetValue(key, out var oldBalance))
					{
						oldBalance = await GetCurrentBalanceAsync(productId, warehouseId);
					}

					if (totalQuantity > oldBalance)
					{
						throw new InvalidOperationException($"Insufficient quantity for product {productId} in warehouse {warehouseId}. Available: {oldBalance}, requested: {totalQuantity}.");
					}

					var newBalance = oldBalance - totalQuantity;
					balanceCache[key] = newBalance;

					var inventoryRecord = new Inventory
					{
						Id = Guid.NewGuid(),
						TransactionType = TransactionTypeEnum.INVOICE,
						ProductId = productId,
						WarehouseId = warehouseId,
						StockRecieveId = Guid.Empty,
						StockTransferId = Guid.Empty,
						InvoiceId = invoice.Id,
						QuantityIn = 0,
						QuantityOut = totalQuantity,
						OldBalance = oldBalance,
						NewBalance = newBalance,
						UnitPrice = productCostMap.TryGetValue(productId, out var unitCost) ? unitCost ?? 0 : 0,
						Remark = $"Invoice: {invoice.Number}"
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

		private Guid GetInvoiceWarehouseId(Invoice invoice)
		{
			if (invoice.WarehouseId.HasValue && invoice.WarehouseId.Value != Guid.Empty)
			{
				return invoice.WarehouseId.Value;
			}

			throw new InvalidOperationException("Warehouse is required for invoice inventory processing.");
		}
	}
}

