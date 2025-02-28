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
            foreach (var item in stockIn.StockInItems ?? [])
            {
                // Retrieve the existing inventory record for the product and warehouse
                var existingInventory = await _context.Inventories
                    .Where(i => i.ProductId == item.ProductId && i.WarehouseId == stockIn.WarehouseId)
                    .OrderByDescending(i => i.ChangedAt) // Get the latest record for this product in this warehouse
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
        }         
        public async Task StockTransferAsync(StockTransfer stockTransfer)
        {
            foreach(var stockTransferItem in stockTransfer.StockTransferItems ?? [])
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
        }
        public async Task StockOutAsync(StockOut stockOut)
        {
            foreach (var item in stockOut.StockOutItems ?? [])
            { 
                // Retrieve the latest inventory record for each warehouse
                var inventories = await _context.Inventories
                .Where(i => i.ProductId == item.ProductId && i.NewBalance > 0)
                .GroupBy(i => i.WarehouseId)
                .Select(g => g.OrderByDescending(i => i.CreatedAt).FirstOrDefault())
                .ToListAsync();

                if (!inventories.Any())
                {
                    throw new Exception("No stock available for the specified product.");
                }

                int remainingQuantity = item.Quantity;

                foreach (var inventory in inventories)
                {
                    if (remainingQuantity == 0) break;

                    int availableQuantity = inventory?.NewBalance ?? 0;
                    int quantityToDeduct = Math.Min(availableQuantity, remainingQuantity);

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

                if (remainingQuantity > 0)
                {
                    throw new Exception("Not enough stock available across warehouses.");
                }
            }

            await _context.SaveChangesAsync();
        } 
    }
}
