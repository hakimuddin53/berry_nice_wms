using ClosedXML.Excel;
using Wms.Api.Entities;
using Wms.Api.Repositories;
using Wms.Api.Model;
using Wms.Api.Context;
using Microsoft.EntityFrameworkCore;

namespace Wms.Api.Services
{
    public class ProductService(IProductRepository productRepository, IRunningNumberService runningNumberService, ApplicationDbContext context) : IProductService
    {
        public async Task<(bool IsSuccess, string ErrorMessage)> BulkUploadProducts(IFormFile file)
        {
            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var workbook = new XLWorkbook(stream))
                    {
                        var worksheet = workbook.Worksheet(1);

                        var expectedHeaders = new List<string>
                {
                    "Name", "ItemCode", "ClientCode", "StockGroup", "InboundQuantity",
                    "Category", "Colour", "Design", "Size", "ListPrice", "QuantityPerCarton", "Threshold",
                    "Rack", "Warehouse"
                };

                        var actualHeaders = worksheet.Row(1).Cells(1, expectedHeaders.Count)
                            .Select(cell => cell.GetString().Trim())
                            .ToList();

                        if (!expectedHeaders.SequenceEqual(actualHeaders))
                        {
                            throw new Exception("Invalid file format. Please check the file headers.");
                        }

                        var rowCount = worksheet.RowsUsed().Count();

                        for (int row = 2; row <= rowCount; row++)
                        {
                            var clientCodeName = worksheet.Cell(row, 3).GetString();
                            var stockGroupName = worksheet.Cell(row, 4).GetString();
                            var categoryName = worksheet.Cell(row, 6).GetString();
                            var colourName = worksheet.Cell(row, 7).GetString();
                            var designName = worksheet.Cell(row, 8).GetString();
                            var sizeName = worksheet.Cell(row, 9).GetString();
                            var rackName = worksheet.Cell(row, 13).GetString();
                            var warehouseName = worksheet.Cell(row, 14).GetString();
                            var inboundQuantity = worksheet.Cell(row, 5).GetValue<int>();

                            var categoryId = await productRepository.GetOrCreateCategoryIdAsync(categoryName);
                            var sizeId = await productRepository.GetOrCreateSizeIdAsync(sizeName);
                            var colourId = await productRepository.GetOrCreateColourIdAsync(colourName);
                            var designId = await productRepository.GetOrCreateDesignIdAsync(designName);
                            var cartonSizeId = await productRepository.GetOrCreateCartonSizeIdAsync(stockGroupName);
                            var rackId = await productRepository.GetOrCreateRackIdAsync(rackName);
                            var clientCodeId = await productRepository.GetOrCreateClientCodeIdAsync(clientCodeName);
                            var warehouseId = await productRepository.GetOrCreateWarehouseIdAsync(warehouseName);

                            var productName = worksheet.Cell(row, 1).GetString();
                            var itemCode = worksheet.Cell(row, 2).GetString();
                            var listPrice = worksheet.Cell(row, 10).GetValue<decimal>();
                            var quantityPerCarton = worksheet.Cell(row, 11).GetValue<int>();
                            var threshold = worksheet.Cell(row, 12).GetValue<int>();

                            // Check if product exists by all criteria
                            var existingProduct = await productRepository.GetProductByAllCriteriaAsync(
                                itemCode: itemCode,
                                clientCodeId: clientCodeId,
                                cartonSizeId: cartonSizeId,
                                categoryId: categoryId,
                                colourId: colourId,
                                designId: designId,
                                sizeId: sizeId);

                            if (existingProduct == null)
                            {
                                // Create product
                                var product = new Product
                                {
                                    Name = productName,
                                    ItemCode = itemCode,
                                    ClientCodeId = clientCodeId,
                                    QuantityPerCarton = quantityPerCarton,
                                    CategoryId = categoryId,
                                    SizeId = sizeId,
                                    ColourId = colourId,
                                    DesignId = designId,
                                    CartonSizeId = cartonSizeId,
                                    ListPrice = listPrice,
                                    Threshold = threshold,
                                    SerialNumber =
                                        await runningNumberService.GenerateRunningNumberAsync(
                                            OperationTypeEnum.PRODUCT)
                                };

                                await productRepository.AddProductAsync(product);

                                // Add initial inventory record
                                var inventory = new Inventory
                                {
                                    ProductId = product.Id,
                                    TransactionType = TransactionTypeEnum.BULKUPLOAD,
                                    CurrentLocationId = rackId,
                                    WarehouseId = warehouseId,
                                    QuantityIn = inboundQuantity,
                                    NewBalance = inboundQuantity,
                                    Remark = "Uploaded by bulk"
                                };

                                await productRepository.AddInventoryRecordAsync(inventory);

                                // Add inventory balance record for new product
                                var inventoryBalance = new InventoryBalance
                                {
                                    Id = Guid.NewGuid(),
                                    ProductId = product.Id,
                                    WarehouseId = warehouseId,
                                    CurrentLocationId = rackId,
                                    Quantity = inboundQuantity
                                };

                                context.InventoryBalances.Add(inventoryBalance);
                            }
                            else
                            {
                                // Retrieve the existing inventory record for the product and warehouse/rack (latest)
                                var existingInventory = await context.Inventories
                                    .Where(i => i.ProductId == existingProduct.Id && i.WarehouseId == warehouseId && i.CurrentLocationId == rackId)
                                    .OrderByDescending(i => i.CreatedAt)
                                    .FirstOrDefaultAsync();

                                // Calculate old and new balances
                                int oldBalance = existingInventory != null ? existingInventory.NewBalance : 0;
                                int newBalance = oldBalance + inboundQuantity;

                                var inventory = new Inventory
                                {
                                    Id = Guid.NewGuid(),
                                    TransactionType = TransactionTypeEnum.BULKUPLOAD,
                                    ProductId = existingProduct.Id,
                                    CurrentLocationId = rackId,
                                    WarehouseId = warehouseId,
                                    QuantityIn = inboundQuantity,
                                    QuantityOut = 0,
                                    OldBalance = oldBalance,
                                    NewBalance = newBalance,
                                    Remark = "Bulk upload adjustment"
                                };

                                await productRepository.AddInventoryRecordAsync(inventory);

                                // Update or add inventory balance record
                                var existingBalance = await context.InventoryBalances
                                    .FirstOrDefaultAsync(b =>
                                        b.ProductId == existingProduct.Id &&
                                        b.WarehouseId == warehouseId &&
                                        b.CurrentLocationId == rackId);

                                if (existingBalance == null)
                                {
                                    var newBalanceRecord = new InventoryBalance
                                    {
                                        Id = Guid.NewGuid(),
                                        ProductId = existingProduct.Id,
                                        WarehouseId = warehouseId,
                                        CurrentLocationId = rackId,
                                        Quantity = inboundQuantity
                                    };
                                    context.InventoryBalances.Add(newBalanceRecord);
                                }
                                else
                                {
                                    existingBalance.Quantity += inboundQuantity;
                                    context.InventoryBalances.Update(existingBalance);
                                }
                            }

                            await productRepository.SaveChangesAsync();
                            await context.SaveChangesAsync();
                        }
                    }
                }

                return (true, "");
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }
    }
}