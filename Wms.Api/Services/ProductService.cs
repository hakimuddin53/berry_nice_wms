using ClosedXML.Excel;
using Wms.Api.Entities;
using Wms.Api.Repositories;
using Wms.Api.Model; 

 
namespace Wms.Api.Services
{
    public class ProductService(IProductRepository productRepository, IRunningNumberService runningNumberService) : IProductService
    {

        private readonly IProductRepository _productRepository = productRepository;
        private readonly IRunningNumberService _runningNumberService = runningNumberService;

        public async Task<(bool IsSuccess, string ErrorMessage)> BulkUploadProducts(IFormFile file)
        {
            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var workbook = new XLWorkbook(stream))
                    {
                        var worksheet = workbook.Worksheet(1); // Get the first worksheet
                                                               
                        var expectedHeaders = new List<string>
                        {
                            "Name", "ItemCode", "ClientCode", "StockGroup", "InboundQuantity",
                            "Category", "Colour", "Design", "Size", "ListPrice", "QuantityPerCarton", "Threshold"
                        };

                        var actualHeaders = worksheet.Row(1).Cells(1, expectedHeaders.Count)
                            .Select(cell => cell.GetString().Trim())
                            .ToList();

                        if (!expectedHeaders.SequenceEqual(actualHeaders))
                        {
                            throw new Exception("Invalid file format. Please check the file headers.");
                        }

                        var rowCount = worksheet.RowsUsed().Count();

                        // Get the first WarehouseId from the Warehouse table
                        var warehouseId = await _productRepository.GetFirstWarehouseIdAsync();

                        for (int row = 2; row <= rowCount; row++)
                        {
                            // Extract data from Excel
                            var stockGroupName = worksheet.Cell(row, 4).GetString();
                            var categoryName = worksheet.Cell(row, 6).GetString();
                            var colourName = worksheet.Cell(row, 7).GetString();
                            var designName = worksheet.Cell(row, 8).GetString();
                            var sizeName = worksheet.Cell(row, 9).GetString();
                            var inboundQuantity = worksheet.Cell(row, 5).GetValue<int>();

                            // Check if the product already exists
                            var existingProduct = await _productRepository.GetProductByItemCodeAsync(worksheet.Cell(row, 1).GetString());
                            if (existingProduct == null)
                            {
                                // Get or create IDs for related entities
                                var categoryId = await _productRepository.GetOrCreateCategoryIdAsync(categoryName);
                                var sizeId = await _productRepository.GetOrCreateSizeIdAsync(sizeName);
                                var colourId = await _productRepository.GetOrCreateColourIdAsync(colourName);
                                var designId = await _productRepository.GetOrCreateDesignIdAsync(designName);
                                var cartonSizeId = await _productRepository.GetOrCreateCartonSizeIdAsync(stockGroupName);

                                // Create product
                                var product = new Product
                                {
                                    Name = worksheet.Cell(row, 1).GetString(),
                                    ItemCode = worksheet.Cell(row, 2).GetString(),
                                    ClientCode = Enum.Parse<ClientCodeEnum>(worksheet.Cell(row, 3).GetString()),
                                    QuantityPerCarton = worksheet.Cell(row, 11).GetValue<int>(),
                                    CategoryId = categoryId,
                                    SizeId = sizeId,
                                    ColourId = colourId,
                                    DesignId = designId,
                                    CartonSizeId = cartonSizeId,
                                    ListPrice = worksheet.Cell(row, 10).GetValue<decimal>(),
                                    Threshold = worksheet.Cell(row, 12).GetValue<int>(),
                                    SerialNumber = await _runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.PRODUCTSERIALNUMBER)
                                };

                                await _productRepository.AddProductAsync(product);

                                // Insert a record into the Inventory table
                                var inventory = new Inventory
                                {
                                    ProductId = product.Id,
                                    TransactionType = TransactionTypeEnum.STOCKIN,
                                    WarehouseId = warehouseId,
                                    QuantityIn = inboundQuantity,
                                    NewBalance = inboundQuantity,
                                    Remark = "Uploaded by bulk"
                                };

                                // Add the new stock-in record to the database
                                await _productRepository.AddInventoryRecordAsync(inventory);
                            }
                        }

                        // Save changes to the database
                        await _productRepository.SaveChangesAsync();
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