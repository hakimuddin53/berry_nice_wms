using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Entities;
using Wms.Api.Model;

namespace Wms.Api.Services
{
	public class InventoryService : IInventoryService
	{
		private readonly ApplicationDbContext _context;
		private readonly IRunningNumberService _runningNumberService;
		private static readonly HashSet<string> ServiceProductCodes = new(StringComparer.OrdinalIgnoreCase) { "POSTAGE", "LALAMOVE", "ACCESSORY" };

		public InventoryService(ApplicationDbContext context, IRunningNumberService runningNumberService)
		{
			_context = context;
			_runningNumberService = runningNumberService;
		}

		public async Task<List<StockTransfer>> StockTransferAsync(StockTransferRequest request)
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
				var transferNumber = string.IsNullOrWhiteSpace(request.Number)
					? await _runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKTRANSFER)
					: request.Number!;

				var balanceCache = new Dictionary<(Guid ProductId, Guid WarehouseId), int>();

				var groupedItems = request.Items
					.Where(i => i.ProductId != Guid.Empty && i.Quantity > 0)
					.GroupBy(i => i.ProductId)
					.ToList();

				var inventoryRecords = new List<Inventory>();
				var stockTransfers = new List<StockTransfer>();

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

					if (totalQuantity > fromOldBalance)
					{
						throw new InvalidOperationException($"Insufficient quantity for product {productId} in warehouse {request.FromWarehouseId}. Available: {fromOldBalance}, requested: {totalQuantity}.");
					}

					var fromNewBalance = checked(fromOldBalance - totalQuantity);
					balanceCache[fromKey] = fromNewBalance;

					var stockTransferId = Guid.NewGuid();
					stockTransfers.Add(new StockTransfer
					{
						Id = stockTransferId,
						Number = transferNumber,
						ProductId = productId,
						QuantityTransferred = totalQuantity,
						FromWarehouseId = request.FromWarehouseId,
						ToWarehouseId = request.ToWarehouseId
					});

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
						Remark = group.FirstOrDefault()?.Remark ?? $"Stock Transfer Out - {transferNumber}"
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
						Remark = group.FirstOrDefault()?.Remark ?? $"Stock Transfer In - {transferNumber}"
					});
				}

				_context.StockTransfers.AddRange(stockTransfers);
				_context.Inventories.AddRange(inventoryRecords);
				await _context.SaveChangesAsync();
				await transaction.CommitAsync();
				return stockTransfers;
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

				var serviceProductIds = await GetServiceProductIdsAsync(productIds);

				var productGroups = invoice.InvoiceItems
					.Where(i => i.ProductId.HasValue && i.ProductId.Value != Guid.Empty)
					.GroupBy(i => i.ProductId!.Value)
					.ToList();

				var inventoryRecords = new List<Inventory>();

				foreach (var productGroup in productGroups)
				{
					var productId = productGroup.Key;
					var totalQuantity = productGroup.Sum(i => i.Quantity);

					if (serviceProductIds.Contains(productId))
					{
                        // service item will not affect inventory balance                         
						continue;
					}

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

		private async Task<HashSet<Guid>> GetServiceProductIdsAsync(IEnumerable<Guid> productIds)
		{
			var ids = productIds?.Distinct().ToList() ?? new List<Guid>();
			if (ids.Count == 0)
			{
				return new HashSet<Guid>();
			}

			var serviceCategoryId = await _context.Lookups
				.Where(l => l.GroupKey == LookupGroupKey.ProductCategory && l.Code == "SERVICE")
				.Select(l => l.Id)
				.FirstOrDefaultAsync();

			var products = await _context.Products
				.Where(p => ids.Contains(p.ProductId))
				.Select(p => new { p.ProductId, p.CategoryId, p.ProductCode })
				.ToListAsync();

			return products
				.Where(p =>
					(serviceCategoryId != Guid.Empty && p.CategoryId == serviceCategoryId) ||
					(!string.IsNullOrWhiteSpace(p.ProductCode) && ServiceProductCodes.Contains(p.ProductCode)))
				.Select(p => p.ProductId)
				.ToHashSet();
		}

		public async Task<StockTake> StockTakeAsync(StockTakeRequest request)
		{
			ArgumentNullException.ThrowIfNull(request);
			if (request.WarehouseId == Guid.Empty)
			{
				throw new ArgumentException("Warehouse is required for stock take.");
			}

			if (request.Items == null || request.Items.Count == 0)
			{
				throw new ArgumentException("At least one stock take item is required.");
			}

			var validItems = request.Items
				.Where(i =>
					(i.ProductId.HasValue && i.ProductId.Value != Guid.Empty) ||
					!string.IsNullOrWhiteSpace(i.ScannedBarcode))
				.ToList();

			if (validItems.Count == 0)
			{
				throw new ArgumentException("Each item must have a product or scanned barcode.");
			}

			await using var transaction = await _context.Database.BeginTransactionAsync();

			try
			{
				var stockTake = new StockTake
				{
					Id = Guid.NewGuid(),
					Number = await _runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKTAKE),
					WarehouseId = request.WarehouseId,
					TakenAt = DateTime.UtcNow,
					Remark = request.Remark
				};

				var itemEntities = new List<StockTakeItem>();

				foreach (var item in validItems)
				{
					var productId = item.ProductId.HasValue && item.ProductId.Value != Guid.Empty
						? item.ProductId
						: null;

					var systemQty = 0;

					if (productId.HasValue)
					{
						systemQty = await GetCurrentBalanceAsync(productId.Value, request.WarehouseId);
					}

					var diff = item.CountedQuantity - systemQty;

					itemEntities.Add(new StockTakeItem
					{
						Id = Guid.NewGuid(),
						StockTakeId = stockTake.Id,
						ProductId = productId,
						CountedQuantity = item.CountedQuantity,
						SystemQuantity = systemQty,
						DifferenceQuantity = diff,
						ScannedBarcode = productId.HasValue ? null : item.ScannedBarcode,
						Remark = item.Remark
					});
				}

				stockTake.Items = itemEntities;

				_context.StockTakes.Add(stockTake);

				await _context.SaveChangesAsync();
				await transaction.CommitAsync();
				return stockTake;
			}
			catch
			{
				await transaction.RollbackAsync();
				throw;
			}
		}
	}
}
