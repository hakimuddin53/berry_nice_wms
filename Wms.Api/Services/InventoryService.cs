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
            // Start a database transaction
            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    foreach (var item in stockIn.StockInItems ?? [])
                    {
                        // Retrieve the existing inventory record for the product and warehouse
                        var existingInventory = await context.Inventories
                            .Where(i => i.ProductId == item.ProductId && i.WarehouseId == stockIn.WarehouseId && i.CurrentLocationId == item.LocationId)
                            .OrderByDescending(i => i.CreatedAt)  
                            .FirstOrDefaultAsync();

                        // Calculate old and new balances
                        int oldBalance = existingInventory != null ? existingInventory.NewBalance : 0;
                        int newBalance = oldBalance + item.Quantity;

                        // Create a new inventory record for the stock-in operation
                        var inventory = new Inventory
                        {
                            Id = Guid.NewGuid(),
                            TransactionType = TransactionTypeEnum.STOCKIN,
                            ProductId = item.ProductId,
                            CurrentLocationId = item.LocationId,
                            WarehouseId = stockIn.WarehouseId,
                            StockInId = item.StockInId,
                            QuantityIn = item.Quantity,
                            QuantityOut = 0,
                            OldBalance = oldBalance,
                            NewBalance = newBalance
                        };

                        // Add the new stock-in record to the database
                        context.Inventories.Add(inventory);
                    }

                    await context.SaveChangesAsync();

                    // If SaveChangesAsync was successful, commit the transaction
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    // If any error occurred, roll back the entire transaction
                    await transaction.RollbackAsync();
                 
                    throw new Exception($"Stock In failed: {ex.Message}", ex);
                }
            }
        }

        public async Task StockOutAsync(StockOut stockOut)
        {
            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    foreach (var item in stockOut.StockOutItems ?? [])
                    {
                        // Retrieve the existing inventory record for the product, warehouse, and location
                        var existingInventory = await context.Inventories
                            .Where(i => i.ProductId == item.ProductId
                                        && i.WarehouseId == stockOut.WarehouseId
                                        && i.CurrentLocationId == item.LocationId)
                            .OrderByDescending(i => i.CreatedAt)
                            .FirstOrDefaultAsync();

                        int oldBalance = existingInventory != null ? existingInventory.NewBalance : 0;

                        // Check if there is enough stock available
                        if (oldBalance < item.Quantity)
                        {
                            throw new InvalidOperationException($"Insufficient stock for ProductId {item.ProductId}. Required: {item.Quantity}, Available: {oldBalance}.");
                        }

                        int newBalance = oldBalance - item.Quantity;

                        // Create a new inventory record for the stock-out operation
                        var inventory = new Inventory
                        {
                            Id = Guid.NewGuid(),
                            TransactionType = TransactionTypeEnum.STOCKOUT,
                            ProductId = item.ProductId,
                            CurrentLocationId = item.LocationId,
                            WarehouseId = stockOut.WarehouseId,
                            StockOutId = stockOut.Id, // Assuming StockOutId is part of stockOut parameter, or passed in item
                            QuantityIn = 0,
                            QuantityOut = item.Quantity,
                            OldBalance = oldBalance,
                            NewBalance = newBalance,
                        };

                        // Add the new stock-out record to the database
                        context.Inventories.Add(inventory);
                    }

                    await context.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new Exception($"Stock Out failed: {ex.Message}", ex);
                }
            }

        }
        public async Task StockAdjustmentAsync(StockAdjustment stockAdjustment)
        {
            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    foreach (var item in stockAdjustment.StockAdjustmentItems ?? Enumerable.Empty<StockAdjustmentItem>())
                    {
                        // Retrieve latest inventory record for product, warehouse, and location
                        var existingInventory = await context.Inventories
                            .Where(i => i.ProductId == item.ProductId 
                                        && i.WarehouseId == stockAdjustment.WarehouseId
                                        && i.CurrentLocationId == item.LocationId)
                            .OrderByDescending(i => i.CreatedAt)
                            .FirstOrDefaultAsync();

                        int oldBalance = existingInventory?.NewBalance ?? 0;
                        int newBalance = item.Quantity; // New balance is the quantity input directly

                        // If new balance is negative, check stock sufficiency (oldBalance >= 0 but we cannot have negative stock)
                        if (newBalance < 0)
                        {
                            throw new InvalidOperationException(
                                $"Invalid new balance for ProductId {item.ProductId}. " +
                                $"Quantity cannot be negative.");
                        }

                        // Calculate quantity in and out based on difference between newBalance and oldBalance
                        int quantityDifference = newBalance - oldBalance;
                        int quantityIn = quantityDifference > 0 ? quantityDifference : 0;
                        int quantityOut = quantityDifference < 0 ? -quantityDifference : 0;

                        var inventory = new Inventory
                        {
                            Id = Guid.NewGuid(),
                            TransactionType = TransactionTypeEnum.STOCKADJUSTMENT,
                            ProductId = item.ProductId,
                            CurrentLocationId = item.LocationId,
                            WarehouseId = stockAdjustment.WarehouseId, 
                            StockAdjustmentId = stockAdjustment.Id,
                            QuantityIn = quantityIn,
                            QuantityOut = quantityOut,
                            OldBalance = oldBalance,
                            NewBalance = newBalance,
                        };

                        context.Inventories.Add(inventory);
                    }

                    await context.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new Exception($"Stock Adjustment failed: {ex.Message}", ex);
                }
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
                    var sourceInventory = await context.Inventories
                        .Where(i => i.ProductId == item.ProductId && i.WarehouseId == item.FromWarehouseId &&
                                    i.CurrentLocationId == item.FromLocationId)
                        .OrderByDescending(i => i.CreatedAt)
                        .FirstOrDefaultAsync();

                    if (sourceInventory == null || sourceInventory.NewBalance < item.QuantityTransferred)
                        throw new InvalidOperationException(
                            $"Insufficient stock for product {item.ProductId} in source warehouse/location.");

                    var destinationInventory = await context.Inventories
                        .Where(i => i.ProductId == item.ProductId && i.WarehouseId == item.ToWarehouseId &&
                                    i.CurrentLocationId == item.ToLocationId)
                        .OrderByDescending(i => i.CreatedAt)
                        .FirstOrDefaultAsync();

                    // Calculate new balances
                    int sourceOldBalance = sourceInventory.NewBalance;
                    int sourceNewBalance = sourceOldBalance - item.QuantityTransferred;

                    int destinationOldBalance = destinationInventory?.NewBalance ?? 0;
                    int destinationNewBalance = destinationOldBalance + item.QuantityTransferred;

                    var stockTransferId = stockTransfer.Id; // Using the main StockTransfer.Id here for consistency

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
                }

                await context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Ideally use a logging service here
                // Logger.LogError(ex, "Stock transfer operation failed");
                throw new Exception($"Stock Transfer failed: {ex.Message}", ex);
            }
        }
    }
}
