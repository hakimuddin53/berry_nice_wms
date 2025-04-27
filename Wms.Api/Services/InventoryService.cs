using Microsoft.EntityFrameworkCore; 
using Wms.Api.Context;
using Wms.Api.Entities;
using Wms.Api.Model; 

namespace Wms.Api.Services
{
    public class InventoryService(ApplicationDbContext context) : IInventoryService
    {
        private readonly ApplicationDbContext _context = context;

        public async Task StockInAsync(StockIn stockIn)
        {
            // Start a database transaction
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    foreach (var item in stockIn.StockInItems ?? [])
                    {
                        // Retrieve the existing inventory record for the product and warehouse
                        var existingInventory = await _context.Inventories
                            .Where(i => i.ProductId == item.ProductId && i.WarehouseId == stockIn.WarehouseId)
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
                            CurrentLocationId = stockIn.LocationId,
                            WarehouseId = stockIn.WarehouseId,
                            StockInId = item.StockInId,
                            QuantityIn = item.Quantity,
                            QuantityOut = 0,
                            OldBalance = oldBalance,
                            NewBalance = newBalance
                        };

                        // Add the new stock-in record to the database
                        _context.Inventories.Add(inventory);
                    }

                    await _context.SaveChangesAsync();

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
        public async Task StockTransferAsync(StockTransfer stockTransfer)
        {
            // Start a database transaction
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    foreach (var stockTransferItem in stockTransfer.StockTransferItems ?? [])
                    {
                        // Retrieve the latest inventory record for the source warehouse
                        var fromInventory = await _context.Inventories
                            .Where(i => i.ProductId == stockTransferItem.ProductId && i.WarehouseId == stockTransferItem.FromWarehouseId)
                            .OrderByDescending(i => i.CreatedAt)
                            .FirstOrDefaultAsync();

                        // Check if the source inventory exists and has sufficient stock
                        if (fromInventory == null || fromInventory.NewBalance < stockTransferItem.QuantityTransferred)
                        {
                            throw new Exception("Insufficient stock in the source warehouse.");
                        }

                        // Retrieve the latest inventory record for the destination warehouse
                        var toInventory = await _context.Inventories
                            .Where(i => i.ProductId == stockTransferItem.ProductId && i.WarehouseId == stockTransferItem.ToWarehouseId)
                            .OrderByDescending(i => i.CreatedAt)
                            .FirstOrDefaultAsync();

                        // Calculate balances for the source warehouse
                        int fromOldBalance = fromInventory.NewBalance;
                        int fromNewBalance = fromOldBalance - stockTransferItem.QuantityTransferred;

                        // Create a new inventory record for the source warehouse (deduction)
                        var sourceTransaction = new Inventory
                        {
                            Id = Guid.NewGuid(),
                            TransactionType = TransactionTypeEnum.STOCKTRANSFEROUT,
                            ProductId = stockTransferItem.ProductId,
                            WarehouseId = stockTransferItem.FromWarehouseId,
                            StockTransferId = stockTransferItem.StockTransferId,
                            QuantityIn = 0,
                            QuantityOut = stockTransferItem.QuantityTransferred,
                            OldBalance = fromOldBalance,
                            NewBalance = fromNewBalance
                        };

                        // Calculate balances for the destination warehouse
                        int toOldBalance = toInventory != null ? toInventory.NewBalance : 0;
                        int toNewBalance = toOldBalance + stockTransferItem.QuantityTransferred;

                        // Create a new inventory record for the destination warehouse (addition)
                        var destinationTransaction = new Inventory
                        {
                            Id = Guid.NewGuid(),
                            TransactionType = TransactionTypeEnum.STOCKTRANSFERIN,
                            ProductId = stockTransferItem.ProductId,
                            WarehouseId = stockTransferItem.ToWarehouseId,
                            StockTransferId = sourceTransaction.StockTransferId,
                            QuantityIn = stockTransferItem.QuantityTransferred,
                            QuantityOut = 0,
                            OldBalance = toOldBalance,
                            NewBalance = toNewBalance
                        };

                        // Add both transactions to the database
                        _context.Inventories.Add(sourceTransaction);
                        _context.Inventories.Add(destinationTransaction);
                    }

                    // Save changes to the database
                    await _context.SaveChangesAsync();
                    // If SaveChangesAsync was successful, commit the transaction
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    // If any error occurred, roll back the entire transaction
                    await transaction.RollbackAsync();
                    // Log the exception
                    // Logger.LogError(ex, "Error occurred during StockTransfer operation. Transaction rolled back.");
                    // Rethrow or handle
                    throw new Exception($"Stock Transfer failed: {ex.Message}", ex);
                }
            }
        }

        public async Task StockOutAsync(StockOut stockOut)
        {

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {


                    foreach (var item in stockOut.StockOutItems ?? [])
                    {
                        // Retrieve the latest inventory record for each warehouse
                        var latestInventoriesByWarehouse = await _context.Inventories
                        .Where(i => i.ProductId == item.ProductId && i.NewBalance > 0)
                        .GroupBy(i => i.WarehouseId)
                        .Select(g => g.OrderByDescending(i => i.CreatedAt).FirstOrDefault())
                        .Where(i => i != null)
                        .ToListAsync();

                        if (!latestInventoriesByWarehouse.Any())
                        {
                            throw new Exception("No stock available for the specified product.");
                        }

                        int totalAvailableStock = latestInventoriesByWarehouse.Sum(inv => inv?.NewBalance ?? 0);

                        // Check if total stock is sufficient
                        if (totalAvailableStock < item.Quantity)
                        {
                            throw new InvalidOperationException($"Insufficient total stock for ProductId {item.ProductId}. Required: {item.Quantity}, Available: {totalAvailableStock}.");
                        }

                        int remainingQuantity = item.Quantity;

                        foreach (var inventory in latestInventoriesByWarehouse)
                        {
                            if (remainingQuantity == 0) break;

                            int availableQuantity = inventory?.NewBalance ?? 0;
                            int quantityToDeduct = Math.Min(availableQuantity, remainingQuantity);

                            if (quantityToDeduct > 0)
                            {
                                var stockOutTransaction = new Inventory
                                {
                                    Id = Guid.NewGuid(),
                                    TransactionType = TransactionTypeEnum.STOCKOUT,
                                    ProductId = item.ProductId,
                                    WarehouseId = inventory?.WarehouseId ?? Guid.Empty,
                                    StockOutId = Guid.NewGuid(),
                                    QuantityIn = 0,
                                    QuantityOut = quantityToDeduct,
                                    OldBalance = inventory?.NewBalance ?? 0,
                                    NewBalance = (inventory?.NewBalance ?? 0) - quantityToDeduct
                                };

                                _context.Inventories.Add(stockOutTransaction);

                                remainingQuantity -= quantityToDeduct;
                            }
                        }


                        // This check should ideally not be needed if the initial total check is correct, but as a safeguard:
                        if (remainingQuantity > 0)
                        {
                            // This indicates a logic error or race condition if reached despite the initial check
                            throw new Exception($"Internal error during stock out: Could not deduct the full quantity {item.Quantity} for ProductId {item.ProductId} even though initial check passed.");
                        }
                    }

                    // Save all changes made within this transaction scope
                    await _context.SaveChangesAsync();

                    // If SaveChangesAsync was successful, commit the transaction
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    // If any error occurred, roll back the entire transaction
                    await transaction.RollbackAsync();
                    // Log the exception
                    // Logger.LogError(ex, "Error occurred during StockOut operation. Transaction rolled back.");
                    // Rethrow or handle
                    throw new Exception($"Stock Out failed: {ex.Message}", ex);
                }
            }
        }
    }
}
