using Microsoft.EntityFrameworkCore; 
using Wms.Api.Context;
using Wms.Api.Entities;
using Wms.Api.Model; 

namespace Wms.Api.Services
{
    public class InventoryService(ApplicationDbContext context) : IInventoryService
    {
        public async Task StockInAsync(StockIn stockIn)
        {
            using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                foreach (var item in stockIn.StockInItems ?? Enumerable.Empty<StockInItem>())
                {
                    var inventoryBalance = await context.InventoryBalances
                        .SingleOrDefaultAsync(ib => ib.ProductId == item.ProductId &&
                                                    ib.WarehouseId == stockIn.WarehouseId &&
                                                    ib.CurrentLocationId == item.LocationId);

                    if (inventoryBalance == null)
                    {
                        inventoryBalance = new InventoryBalance
                        {
                            Id = Guid.NewGuid(),
                            ProductId = item.ProductId,
                            WarehouseId = stockIn.WarehouseId,
                            CurrentLocationId = item.LocationId,
                            Quantity = 0
                        };
                        context.InventoryBalances.Add(inventoryBalance);
                    }

                    var wh = await context.WarehouseInventoryBalances
                                            .SingleOrDefaultAsync(w =>
                                                w.ProductId == item.ProductId &&
                                                w.WarehouseId == stockIn.WarehouseId);

                    if (wh == null)
                    {
                        wh = new WarehouseInventoryBalance
                        {
                            Id = Guid.NewGuid(),
                            ProductId = item.ProductId,
                            WarehouseId = stockIn.WarehouseId
                        };
                        context.WarehouseInventoryBalances.Add(wh);
                    }

                    // update both on-hand and cost accumulators
                    wh.OnHandQuantity += item.Quantity;
                    wh.TotalQtyReceived += item.Quantity;
                    wh.TotalCostAccumulated += item.Quantity * item.UnitPrice;

                    int oldBalance = inventoryBalance.Quantity;
                    int newBalance = oldBalance + item.Quantity;
                    inventoryBalance.Quantity = newBalance;

                    var inventoryRecord = new Inventory
                    {
                        Id = Guid.NewGuid(),
                        TransactionType = TransactionTypeEnum.STOCKIN,
                        ProductId = item.ProductId,
                        WarehouseId = stockIn.WarehouseId,
                        CurrentLocationId = item.LocationId,
                        StockInId = item.StockInId,
                        QuantityIn = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        QuantityOut = 0,
                        OldBalance = oldBalance,
                        NewBalance = newBalance
                    };

                    context.Inventories.Add(inventoryRecord);
                }

                await context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                await transaction.RollbackAsync();
                throw new Exception("Concurrent update detected during Stock In, please retry.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception($"Stock In failed: {ex.Message}", ex);
            }
        }
        public async Task CancelStockOutAsync(Guid stockOutId)
        {
            using var tx = await context.Database.BeginTransactionAsync();
            try
            {
                var so = await context.StockOuts
                    .Include(s => s.StockOutItems)
                    .SingleOrDefaultAsync(s => s.Id == stockOutId);

                if (so == null)
                    throw new KeyNotFoundException($"StockOut {stockOutId} not found.");

                if (so.Status != StockOutStatusEnum.COMPLETED)
                    throw new InvalidOperationException("Only COMPLETED picks can be cancelled.");
 

                // 2) reverse each line’s balances
                foreach (var item in so.StockOutItems ?? Enumerable.Empty<StockOutItem>())
                {
                    var inventoryBalance = await context.InventoryBalances
                          .SingleOrDefaultAsync(ib => ib.ProductId == item.ProductId &&
                                                      ib.WarehouseId == so.WarehouseId &&
                                                      ib.CurrentLocationId == item.LocationId);
 

                    var wh = await context.WarehouseInventoryBalances
                                            .SingleOrDefaultAsync(w =>
                                                w.ProductId == item.ProductId &&
                                                w.WarehouseId == so.WarehouseId);

                    if (wh == null || inventoryBalance == null)
                        throw new Exception();

                    wh.OnHandQuantity += item.Quantity; 

                    int oldBalance = inventoryBalance.Quantity;
                    int newBalance = oldBalance + item.Quantity;
                    inventoryBalance.Quantity = newBalance;

                    var inventoryRecord = new Inventory
                    {
                        Id = Guid.NewGuid(),
                        TransactionType = TransactionTypeEnum.STOCKOUTCANCEL,
                        ProductId = item.ProductId,
                        WarehouseId = so.WarehouseId,
                        CurrentLocationId = item.LocationId,
                        StockOutId = item.StockOutId,
                        QuantityIn = item.Quantity, 
                        QuantityOut = 0,
                        OldBalance = oldBalance,
                        NewBalance = newBalance
                    };

                    context.Inventories.Add(inventoryRecord);
                }

                // 3) mark cancelled
                so.Status = StockOutStatusEnum.CANCELLED;

                await context.SaveChangesAsync();
                await tx.CommitAsync();
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }
        public async Task StockOutAsync(StockOut stockOut)
        {
            using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                foreach (var item in stockOut.StockOutItems ?? Enumerable.Empty<StockOutItem>())
                {
                    var inventoryBalance = await context.InventoryBalances
                        .SingleOrDefaultAsync(ib => ib.ProductId == item.ProductId &&
                                                    ib.WarehouseId == stockOut.WarehouseId &&
                                                    ib.CurrentLocationId == item.LocationId);

                    if (inventoryBalance == null || inventoryBalance.Quantity < item.Quantity)
                    {
                        throw new InvalidOperationException(
                            $"Insufficient stock for ProductId {item.ProductId}. Required: {item.Quantity}, Available: {inventoryBalance?.Quantity ?? 0}.");
                    }

                    int oldBalance = inventoryBalance.Quantity;
                    int newBalance = oldBalance - item.Quantity;
                    inventoryBalance.Quantity = newBalance;


                    // warehouse-level
                    var wh = await context.WarehouseInventoryBalances
                        .SingleOrDefaultAsync(w =>
                            w.ProductId == item.ProductId &&
                            w.WarehouseId == stockOut.WarehouseId);

                    if (wh == null)
                        throw new InvalidOperationException("Warehouse balance missing—cannot stock out.");

                    // just reduce on-hand; receipts stay untouched
                    wh.OnHandQuantity -= item.Quantity;

                    var inventoryRecord = new Inventory
                    {
                        Id = Guid.NewGuid(),
                        TransactionType = TransactionTypeEnum.STOCKOUT,
                        ProductId = item.ProductId,
                        WarehouseId = stockOut.WarehouseId,
                        CurrentLocationId = item.LocationId,
                        StockOutId = stockOut.Id,
                        QuantityIn = 0,
                        QuantityOut = item.Quantity,
                        OldBalance = oldBalance,
                        NewBalance = newBalance
                    };

                    context.Inventories.Add(inventoryRecord);
                }

                await context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                await transaction.RollbackAsync();
                throw new Exception("Concurrent update detected during Stock Out, please retry.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception($"Stock Out failed: {ex.Message}", ex);
            }
        }
        public async Task StockAdjustmentAsync(StockAdjustment stockAdjustment)
        {
            using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                foreach (var item in stockAdjustment.StockAdjustmentItems ?? Enumerable.Empty<StockAdjustmentItem>())
                {
                    var inventoryBalance = await context.InventoryBalances
                        .SingleOrDefaultAsync(ib => ib.ProductId == item.ProductId &&
                                                    ib.WarehouseId == stockAdjustment.WarehouseId &&
                                                    ib.CurrentLocationId == item.LocationId);

                    int oldBalance = inventoryBalance?.Quantity ?? 0;
                    int newBalance = item.Quantity;

                    if (newBalance < 0)
                        throw new InvalidOperationException($"Invalid new balance for ProductId {item.ProductId}. Quantity cannot be negative.");

                    if (inventoryBalance == null)
                    {
                        inventoryBalance = new InventoryBalance
                        {
                            Id = Guid.NewGuid(),
                            ProductId = item.ProductId,
                            WarehouseId = stockAdjustment.WarehouseId,
                            CurrentLocationId = item.LocationId,
                            Quantity = newBalance
                        };
                        context.InventoryBalances.Add(inventoryBalance);
                    }
                    else
                    {
                        inventoryBalance.Quantity = newBalance;
                    }

                    int quantityDifference = newBalance - oldBalance;
                    int quantityIn = quantityDifference > 0 ? quantityDifference : 0;
                    int quantityOut = quantityDifference < 0 ? -quantityDifference : 0;


                    // warehouse-level
                    var wh = await context.WarehouseInventoryBalances
                        .SingleOrDefaultAsync(w =>
                            w.ProductId == item.ProductId &&
                            w.WarehouseId == stockAdjustment.WarehouseId);
                     
                    if (wh == null)
                    {
                        wh = new WarehouseInventoryBalance
                        {
                            Id = Guid.NewGuid(),
                            ProductId = item.ProductId,
                            WarehouseId = stockAdjustment.WarehouseId, 
                            OnHandQuantity = newBalance
                        };
                        context.WarehouseInventoryBalances.Add(wh);
                    }
                    else
                    {
                        wh.OnHandQuantity += newBalance;
                    }

                    var inventoryRecord = new Inventory
                    {
                        Id = Guid.NewGuid(),
                        TransactionType = TransactionTypeEnum.STOCKADJUSTMENT,
                        ProductId = item.ProductId,
                        WarehouseId = stockAdjustment.WarehouseId,
                        CurrentLocationId = item.LocationId,
                        StockAdjustmentId = stockAdjustment.Id,
                        QuantityIn = quantityIn,
                        QuantityOut = quantityOut,
                        OldBalance = oldBalance,
                        NewBalance = newBalance
                    };

                    context.Inventories.Add(inventoryRecord);
                }

                await context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                await transaction.RollbackAsync();
                throw new Exception("Concurrent update detected during Stock Adjustment, please retry.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception($"Stock Adjustment failed: {ex.Message}", ex);
            }
        }
        public async Task StockTransferAsync(StockTransfer stockTransfer)
        {
            if (stockTransfer == null)
                throw new ArgumentNullException(nameof(stockTransfer));

            if (stockTransfer.StockTransferItems == null || !stockTransfer.StockTransferItems.Any())
                throw new ArgumentException("StockTransferItems cannot be null or empty.", nameof(stockTransfer));

            using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                foreach (var item in stockTransfer.StockTransferItems)
                {
                    var sourceBalance = await context.InventoryBalances
                        .SingleOrDefaultAsync(ib => ib.ProductId == item.ProductId &&
                                                    ib.WarehouseId == item.FromWarehouseId &&
                                                    ib.CurrentLocationId == item.FromLocationId);

                    if (sourceBalance == null || sourceBalance.Quantity < item.QuantityTransferred)
                        throw new InvalidOperationException($"Insufficient stock for product {item.ProductId} in source warehouse/location.");

                    var destinationBalance = await context.InventoryBalances
                        .SingleOrDefaultAsync(ib => ib.ProductId == item.ProductId &&
                                                    ib.WarehouseId == item.ToWarehouseId &&
                                                    ib.CurrentLocationId == item.ToLocationId);

                    int sourceOldBalance = sourceBalance.Quantity;
                    int sourceNewBalance = sourceOldBalance - item.QuantityTransferred;
                    sourceBalance.Quantity = sourceNewBalance;

                    int destinationOldBalance = destinationBalance?.Quantity ?? 0;
                    int destinationNewBalance = destinationOldBalance + item.QuantityTransferred;

                    if (destinationBalance == null)
                    {
                        destinationBalance = new InventoryBalance
                        {
                            Id = Guid.NewGuid(),
                            ProductId = item.ProductId,
                            WarehouseId = item.ToWarehouseId,
                            CurrentLocationId = item.ToLocationId,
                            Quantity = destinationNewBalance
                        };
                        context.InventoryBalances.Add(destinationBalance);
                    }
                    else
                    {
                        destinationBalance.Quantity = destinationNewBalance;
                    }

                    var stockTransferId = stockTransfer.Id;

                    var sourceTransaction = new Inventory
                    {
                        Id = Guid.NewGuid(),
                        TransactionType = TransactionTypeEnum.STOCKTRANSFEROUT,
                        ProductId = item.ProductId,
                        WarehouseId = item.FromWarehouseId,
                        CurrentLocationId = item.FromLocationId,
                        StockTransferId = stockTransferId,
                        QuantityIn = 0,
                        QuantityOut = item.QuantityTransferred,
                        OldBalance = sourceOldBalance,
                        NewBalance = sourceNewBalance,
                        CreatedAt = DateTime.UtcNow
                    };

                    var destinationTransaction = new Inventory
                    {
                        Id = Guid.NewGuid(),
                        TransactionType = TransactionTypeEnum.STOCKTRANSFERIN,
                        ProductId = item.ProductId,
                        WarehouseId = item.ToWarehouseId,
                        CurrentLocationId = item.ToLocationId,
                        StockTransferId = stockTransferId,
                        QuantityIn = item.QuantityTransferred,
                        QuantityOut = 0,
                        OldBalance = destinationOldBalance,
                        NewBalance = destinationNewBalance,
                        CreatedAt = DateTime.UtcNow
                    };

                    context.Inventories.Add(sourceTransaction);
                    context.Inventories.Add(destinationTransaction);

                    // warehouse-level source
                    var srcWh = await context.WarehouseInventoryBalances
                        .SingleOrDefaultAsync(w =>
                            w.ProductId == item.ProductId &&
                            w.WarehouseId == item.FromWarehouseId);
                    if (srcWh == null)
                        throw new InvalidOperationException("Source warehouse balance missing.");
                    srcWh.OnHandQuantity -= item.QuantityTransferred;

                    // warehouse-level destination
                    var dstWh = await context.WarehouseInventoryBalances
                        .SingleOrDefaultAsync(w =>
                            w.ProductId == item.ProductId &&
                            w.WarehouseId == item.ToWarehouseId);
                    if (dstWh == null)
                    {
                        dstWh = new WarehouseInventoryBalance
                        {
                            Id = Guid.NewGuid(),
                            ProductId = item.ProductId,
                            WarehouseId = item.ToWarehouseId
                        };
                        context.WarehouseInventoryBalances.Add(dstWh);
                    }
                    dstWh.OnHandQuantity += item.QuantityTransferred;
                }

                await context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                await transaction.RollbackAsync();
                throw new Exception("Concurrent update detected during Stock Transfer, please retry.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception($"Stock Transfer failed: {ex.Message}", ex);
            }
        }
    }
}
