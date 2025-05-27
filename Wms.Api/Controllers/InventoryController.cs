using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;
using Wms.Api.Entities;
using Wms.Api.Services;
using Wms.Api.Dto.Inventory;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Wms.Api.Context;
using System.ComponentModel;
using Wms.Api.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class InventoryController(
        IService<Inventory> service,
        ApplicationDbContext context,
        IMapper autoMapperService,
        RoleManager<ApplicationRole> roleManager,
        UserManager<ApplicationUser> userManager)
        : ControllerBase
    {
        [HttpPost("search", Name = "SearchInventorysAsync")]
        public async Task<IActionResult> SearchInventorysAsync([FromBody] InventorySearchDto inventorySearch)
        {
            var userInfo = await GetUserInformationAsync();
            if (!userInfo.Success)
            {
                return userInfo.ErrorResult!;
            }

            // 1. Get the base-filtered query
            var filteredQuery = GetFilteredInventoryQuery(inventorySearch, userInfo.stockGroupIds, userInfo.IsAdminRole);

            filteredQuery = filteredQuery.OrderByDescending(i => i.CreatedAt);

            var result = filteredQuery.Skip((inventorySearch.Page - 1) * inventorySearch.PageSize)
                .Take(inventorySearch.PageSize).ToList();
            var pagedResult = new PagedList<Inventory>(result, inventorySearch.Page, inventorySearch.PageSize);

            var inventoryDtos = autoMapperService.Map<PagedListDto<InventoryDetailsDto>>(pagedResult);

            foreach (var inventory in inventoryDtos.Data)
            {
                var product = context.Products?.Where(x => x.Id == inventory.ProductId)?.FirstOrDefault();
                inventory.Product = product != null ? $"{product.Name} - {product.ItemCode}" : "";

                inventory.Warehouse =
                    context.Warehouses?.Where(x => x.Id == inventory.WarehouseId)?.FirstOrDefault()?.Name ?? "";
                inventory.CurrentLocation = context.Locations?.Where(x => x.Id == inventory.CurrentLocationId)
                    ?.FirstOrDefault()?.Name ?? "";

                if (product != null)
                {
                    inventory.StockGroup = context.CartonSizes?.Where(x => x.Id == product.CartonSizeId)
                        ?.FirstOrDefault()?.Name ?? "";
                    inventory.ClientCode = context.ClientCodes?.Where(x => x.Id == product.ClientCodeId)
                        ?.FirstOrDefault()?.Name ?? ""; 
                    inventory.Size = context.Sizes?.Where(x => x.Id == product.SizeId)
                        ?.FirstOrDefault()?.Name ?? ""; 
                }
                
                // Set transaction number based on TransactionType
                switch (inventory.TransactionType)
                {
                    case TransactionTypeEnum.STOCKIN:
                        inventory.TransactionNumber = context.StockIns
                            .Where(s => s.Id == inventory.StockInId)
                            .Select(s => s.Number)
                            .FirstOrDefault() ?? "";
                        break;

                    case TransactionTypeEnum.STOCKOUT:
                        inventory.TransactionNumber = context.StockOuts
                            .Where(s => s.Id == inventory.StockOutId)
                            .Select(s => s.Number)
                            .FirstOrDefault() ?? "";
                        break;

                    case TransactionTypeEnum.STOCKTRANSFERIN:
                    case TransactionTypeEnum.STOCKTRANSFEROUT:
                        inventory.TransactionNumber = context.StockTransfers
                            .Where(s => s.Id == inventory.StockTransferId)
                            .Select(s => s.Number)
                            .FirstOrDefault() ?? "";
                        break;

                    case TransactionTypeEnum.STOCKADJUSTMENT:
                        inventory.TransactionNumber = context.StockAdjustments
                            .Where(s => s.Id == inventory.StockAdjustmentId)
                            .Select(s => s.Number)
                            .FirstOrDefault() ?? "";
                        break;

                    default:
                        inventory.TransactionNumber = "";
                        break;
                }

            }

            return Ok(inventoryDtos);
        }

        [HttpPost("count", Name = "CountInventorysAsync")]
        public async Task<IActionResult> CountInventorysAsync([FromBody] InventorySearchDto inventorySearch)
        {
            var result = await GetUserInformationAsync();
            if (!result.Success)
            {
                return result.ErrorResult!;
            }
            
            var filteredQuery = GetFilteredInventoryQuery(inventorySearch,result.stockGroupIds, result.IsAdminRole);

            var inventoryDtos = autoMapperService.Map<List<InventoryDetailsDto>>(filteredQuery);
            return Ok(inventoryDtos.Count);
        }


        [HttpPost("summary/search", Name = "SearchInventorySummaryAsync")]
        public async Task<IActionResult> SearchInventorySummaryAsync([FromBody] InventorySearchDto inventorySearch)
        {
            var result = await GetUserInformationAsync();
            if (!result.Success)
            {
                return result.ErrorResult!;
            }

            // Base filtered query
            var filteredQuery = GetFilteredInventoryQuery(inventorySearch,result.stockGroupIds,  result.IsAdminRole);
             
            var latestDatesPerGroup = filteredQuery
                .GroupBy(i => new { i.ProductId, i.WarehouseId, i.CurrentLocationId })
                .Select(g => new
                {
                    g.Key.ProductId,
                    g.Key.WarehouseId,
                    g.Key.CurrentLocationId,
                    MaxCreatedAt = g.Max(i => i.CreatedAt)
                });

            var groupedQuery = from item in filteredQuery
                                   join latest in latestDatesPerGroup
                                   on new { item.ProductId, item.WarehouseId, item.CurrentLocationId, item.CreatedAt }
                                   equals new { latest.ProductId, latest.WarehouseId, latest.CurrentLocationId, CreatedAt = latest.MaxCreatedAt }
                                   select new
                                   {
                                       item.ProductId,
                                       item.WarehouseId,
                                       item.CurrentLocationId,
                                       item.NewBalance,
                                       item.CreatedAt,
                                       item.ChangedAt
                                   };
             

            var totalCount = await groupedQuery.CountAsync();

            var pagedGroupedData = await groupedQuery
                .Skip((inventorySearch.Page - 1) * inventorySearch.PageSize)
                .Take(inventorySearch.PageSize)
                .ToListAsync();

            // Fetch related data in batch to avoid N+1 query problem
            var productIds = pagedGroupedData.Select(p => p.ProductId).Distinct().ToList();
            var warehouseIds = pagedGroupedData.Select(p => p.WarehouseId).Distinct().ToList();
            var locationIds = pagedGroupedData.Select(p => p.CurrentLocationId).Distinct().ToList();

            var products = await context.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();
            var warehouses = await context.Warehouses.Where(w => warehouseIds.Contains(w.Id)).ToListAsync();
            var locations = await context.Locations.Where(l => locationIds.Contains(l.Id)).ToListAsync();

            // Prepare the result DTOs manually
            var inventorySummaryDtos = pagedGroupedData.Select(item =>
            {
                var product = products.FirstOrDefault(p => p.Id == item.ProductId);
                var warehouse = warehouses.FirstOrDefault(w => w.Id == item.WarehouseId);
                var location = locations.FirstOrDefault(l => l.Id == item.CurrentLocationId);

                var dto = new InventorySummaryDetailsDto
                {
                    ProductId = item.ProductId,
                    WarehouseId = item.WarehouseId,
                    CurrentLocationId = item.CurrentLocationId,
                    AvailableQuantity = item.NewBalance,
                    CreatedAt = item.CreatedAt,
                    ChangedAt = item.ChangedAt,
                    Product = product != null ? $"{product.Name} ({product.ItemCode})" : "",
                    Warehouse = warehouse?.Name ?? "",
                    CurrentLocation = location?.Name ?? ""
                };

                if (product != null)
                {
                    dto.StockGroup = context.CartonSizes?.FirstOrDefault(cs => cs.Id == product.CartonSizeId)?.Name ?? "";
                    dto.ClientCode = context.ClientCodes?.FirstOrDefault(cc => cc.Id == product.ClientCodeId)?.Name ?? "";
                    dto.Size = context.Sizes?.FirstOrDefault(cc => cc.Id == product.SizeId)?.Name ?? "";
                }

                return dto;
            }).ToList();

            var pagedListDto = new PagedListDto<InventorySummaryDetailsDto>
            {
                Data = inventorySummaryDtos,
                CurrentPage = inventorySearch.Page,
                PageSize = inventorySearch.PageSize, 
            };

            return Ok(pagedListDto);
        }

       [HttpPost("export", Name = "ExportInventoryAsync")]
        public async Task<IActionResult> ExportInventoryAsync([FromBody] InventorySearchDto inventorySearch)
        {
            var result = await GetUserInformationAsync();
            if (!result.Success)
            {
                return result.ErrorResult!;
            }

            // Get full filtered query without pagination
            var filteredQuery = GetFilteredInventoryQuery(inventorySearch,result.stockGroupIds,  result.IsAdminRole)
                .OrderByDescending(i => i.CreatedAt);

            var inventoryDtos = autoMapperService.Map<List<InventoryDetailsDto>>(filteredQuery.ToList());

            foreach (var inventory in inventoryDtos)
            {
                var product = context.Products?.FirstOrDefault(x => x.Id == inventory.ProductId);
                inventory.Product = product != null ? $"{product.Name} - {product.ItemCode}" : "";
                inventory.Warehouse = context.Warehouses?.FirstOrDefault(x => x.Id == inventory.WarehouseId)?.Name ?? "";
                inventory.CurrentLocation = context.Locations?.FirstOrDefault(x => x.Id == inventory.CurrentLocationId)?.Name ?? "";

                if (product != null)
                {
                    inventory.StockGroup = context.CartonSizes?.FirstOrDefault(x => x.Id == product.CartonSizeId)?.Name ?? "";
                    inventory.ClientCode = context.ClientCodes?.FirstOrDefault(x => x.Id == product.ClientCodeId)?.Name ?? "";
                    inventory.Size = context.Sizes?.Where(x => x.Id == product.SizeId)
                        ?.FirstOrDefault()?.Name ?? ""; 
                }

                // If you want transaction number here as well, replicate logic from SearchInventorysAsync
                switch (inventory.TransactionType)
                {
                    case TransactionTypeEnum.STOCKIN:
                        inventory.TransactionNumber = context.StockIns
                            .Where(s => s.Id == inventory.StockInId)
                            .Select(s => s.Number)
                            .FirstOrDefault() ?? "";
                        break;

                    case TransactionTypeEnum.STOCKOUT:
                        inventory.TransactionNumber = context.StockOuts
                            .Where(s => s.Id == inventory.StockOutId)
                            .Select(s => s.Number)
                            .FirstOrDefault() ?? "";
                        break;

                    case TransactionTypeEnum.STOCKTRANSFERIN:
                    case TransactionTypeEnum.STOCKTRANSFEROUT:
                        inventory.TransactionNumber = context.StockTransfers
                            .Where(s => s.Id == inventory.StockTransferId)
                            .Select(s => s.Number)
                            .FirstOrDefault() ?? "";
                        break;

                    case TransactionTypeEnum.STOCKADJUSTMENT:
                        inventory.TransactionNumber = context.StockAdjustments
                            .Where(s => s.Id == inventory.StockAdjustmentId)
                            .Select(s => s.Number)
                            .FirstOrDefault() ?? "";
                        break;

                    default:
                        inventory.TransactionNumber = "";
                        break;
                }
            }

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Inventory");

            // Add headers
            worksheet.Cell(1, 1).Value = "Id";
            worksheet.Cell(1, 2).Value = "Product";
            worksheet.Cell(1, 3).Value = "Warehouse";
            worksheet.Cell(1, 4).Value = "Current Location";
            
            worksheet.Cell(1, 5).Value = "Stock Group";
            worksheet.Cell(1, 6).Value = "Client Code";
            worksheet.Cell(1, 7).Value = "Quantity In";
            worksheet.Cell(1, 8).Value = "Quantity Out";
            worksheet.Cell(1, 9).Value = "Old Balance";
            worksheet.Cell(1, 10).Value = "Available Balance";
            worksheet.Cell(1, 11).Value = "Transaction Number";  
            worksheet.Cell(1, 12).Value = "Size";  
            worksheet.Cell(1, 13).Value = "Created At";

            for (int i = 0; i < inventoryDtos.Count; i++)
            {
                var inventory = inventoryDtos[i];
                var row = i + 2;

                worksheet.Cell(row, 1).Value = inventory.Id.ToString();
                worksheet.Cell(row, 2).Value = inventory.Product;
                worksheet.Cell(row, 3).Value = inventory.Warehouse;
                worksheet.Cell(row, 4).Value = inventory.CurrentLocation;
                worksheet.Cell(row, 5).Value = inventory.StockGroup;
                worksheet.Cell(row, 6).Value = inventory.ClientCode;
                worksheet.Cell(row, 7).Value = inventory.QuantityIn;
                worksheet.Cell(row, 8).Value = inventory.QuantityOut;
                worksheet.Cell(row, 9).Value = inventory.OldBalance;
                worksheet.Cell(row, 10).Value = inventory.NewBalance;
                worksheet.Cell(row, 11).Value = inventory.TransactionNumber;  
                worksheet.Cell(row, 12).Value = inventory.Size;  
                worksheet.Cell(row, 13).Value = inventory.CreatedAt;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);

            var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

            var fileName = $"InventoryExport_{DateTime.Now:yyyyMMdd}.xlsx";

            return File(stream.ToArray(), contentType, fileName);
        }


        [HttpPost("summary/export", Name = "ExportInventorySummaryAsync")]
        public async Task<IActionResult> ExportInventorySummaryAsync([FromBody] InventorySearchDto inventorySearch)
        {
            var result = await GetUserInformationAsync();
            if (!result.Success)
            {
                return result.ErrorResult!;
            }

            var filteredQuery = GetFilteredInventoryQuery(inventorySearch, result.stockGroupIds, result.IsAdminRole);

            var latestDatesPerGroup = filteredQuery
                .GroupBy(i => new { i.ProductId, i.WarehouseId, i.CurrentLocationId })
                .Select(g => new
                {
                    g.Key.ProductId,
                    g.Key.WarehouseId,
                    g.Key.CurrentLocationId,
                    MaxCreatedAt = g.Max(i => i.CreatedAt)
                });


            var groupedQuery = from item in filteredQuery
                               join latest in latestDatesPerGroup
                               on new { item.ProductId, item.WarehouseId, item.CurrentLocationId, item.CreatedAt }
                               equals new { latest.ProductId, latest.WarehouseId, latest.CurrentLocationId, CreatedAt = latest.MaxCreatedAt }
                               select new
                               {
                                   item.ProductId,
                                   item.WarehouseId,
                                   item.CurrentLocationId,
                                   AvailableQuantity = item.NewBalance, 
                                   item.CreatedAt,
                                   item.ChangedAt
                               };

             
            var latestInventoryList = await groupedQuery.ToListAsync();
             

            var productIds = latestInventoryList.Select(x => x.ProductId).Distinct().ToList();
            var warehouseIds = latestInventoryList.Select(x => x.WarehouseId).Distinct().ToList();
            var locationIds = latestInventoryList.Select(x => x.CurrentLocationId).Distinct().ToList();

            var products = await context.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();
            var warehouses = await context.Warehouses.Where(w => warehouseIds.Contains(w.Id)).ToListAsync();
            var locations = await context.Locations.Where(l => locationIds.Contains(l.Id)).ToListAsync();

            var inventorySummaryDtos = latestInventoryList.Select(item =>
            {
                var product = products.FirstOrDefault(p => p.Id == item.ProductId);
                var warehouse = warehouses.FirstOrDefault(w => w.Id == item.WarehouseId);
                var location = locations.FirstOrDefault(l => l.Id == item.CurrentLocationId);

                var dto = new InventorySummaryDetailsDto
                {
                    Id = Guid.NewGuid(),
                    ProductId = item.ProductId,
                    WarehouseId = item.WarehouseId,
                    CurrentLocationId = item.CurrentLocationId,
                    AvailableQuantity = item.AvailableQuantity,
                    CreatedAt = item.CreatedAt,
                    ChangedAt = item.ChangedAt,
                    Product = product != null ? $"{product.Name} ({product.ItemCode})" : "",
                    Warehouse = warehouse?.Name ?? "",
                    CurrentLocation = location?.Name ?? ""
                };

                if (product != null)
                {
                    dto.StockGroup = context.CartonSizes?.FirstOrDefault(cs => cs.Id == product.CartonSizeId)?.Name ?? "";
                    dto.ClientCode = context.ClientCodes?.FirstOrDefault(cc => cc.Id == product.ClientCodeId)?.Name ?? "";
                    dto.Size = context.Sizes?.FirstOrDefault(cc => cc.Id == product.SizeId)?.Name ?? "";
                }

                return dto;
            }).ToList();
            

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Inventory Summary");

            // Add headers
            worksheet.Cell(1, 1).Value = "Id";
            worksheet.Cell(1, 2).Value = "Product";
            worksheet.Cell(1, 3).Value = "Warehouse";
            worksheet.Cell(1, 4).Value = "Current Location";
            worksheet.Cell(1, 5).Value = "Available Quantity";
            worksheet.Cell(1, 6).Value = "Stock Group";
            worksheet.Cell(1, 7).Value = "Client Code";
            worksheet.Cell(1, 8).Value = "Size";
            worksheet.Cell(1, 9).Value = "Created At"; 
            for (int i = 0; i < inventorySummaryDtos.Count; i++)
            {
                var summary = inventorySummaryDtos[i];
                var row = i + 2;

                worksheet.Cell(row, 1).Value = summary.Id.ToString();
                worksheet.Cell(row, 2).Value = summary.Product;
                worksheet.Cell(row, 3).Value = summary.Warehouse;
                worksheet.Cell(row, 4).Value = summary.CurrentLocation;
                worksheet.Cell(row, 5).Value = summary.AvailableQuantity;
                worksheet.Cell(row, 6).Value = summary.StockGroup;
                worksheet.Cell(row, 7).Value = summary.ClientCode;
                worksheet.Cell(row, 8).Value = summary.Size; 
                worksheet.Cell(row, 9).Value = summary.CreatedAt; 
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);

            var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            var fileName = $"InventorySummaryExport_{DateTime.Now:yyyyMMdd}.xlsx";

            return File(stream.ToArray(), contentType, fileName);
        }

        [HttpPost("summary/count", Name = "CountInventorySummaryAsync")]
        public async Task<IActionResult> CountInventorySummaryAsync([FromBody] InventorySearchDto inventorySearch)
        {
            var result = await GetUserInformationAsync();
            if (!result.Success)
            {
                return result.ErrorResult!;
            }

            var filteredQuery = GetFilteredInventoryQuery(inventorySearch, result.stockGroupIds,result.IsAdminRole);

            var latestDatesPerGroup = filteredQuery
                .GroupBy(i => new { i.ProductId, i.WarehouseId, i.CurrentLocationId })
                .Select(g => new
                {
                    g.Key.ProductId,
                    g.Key.WarehouseId,
                    g.Key.CurrentLocationId,
                    MaxCreatedAt = g.Max(i => i.CreatedAt)
                });

            var latestInventoryQuery = from item in filteredQuery
                                       join latest in latestDatesPerGroup
                                       on new { item.ProductId, item.WarehouseId, item.CurrentLocationId, item.CreatedAt }
                                       equals new { latest.ProductId, latest.WarehouseId, latest.CurrentLocationId, CreatedAt = latest.MaxCreatedAt }
                                       select item;

            var count = await latestInventoryQuery.CountAsync();

            return Ok(count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await service.GetByIdAsync(id);
            return Ok(product);
        }
        
        private async Task<(bool Success, IActionResult? ErrorResult, string stockGroupIds, bool IsAdminRole)> GetUserInformationAsync()
        {
            var emailClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);

            if (emailClaim == null || string.IsNullOrEmpty(emailClaim.Value))
            {
                return (false, BadRequest("User email is missing or invalid."), null, false);
            }

            var email = emailClaim.Value;
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return (false, BadRequest("User not found."), null, false);
            }

            bool isAdminRole = false;
            var cartonSizeIds = "";
            if (user.UserRoleId != null)
            {
                var userRole = await roleManager.FindByIdAsync(user.UserRoleId.ToString());
                if (userRole != null)
                {
                    // Check if userRole.Name indicates admin role
                    isAdminRole = userRole.Name.Equals("admin", StringComparison.OrdinalIgnoreCase);
                    cartonSizeIds = userRole.CartonSizeId;
                }
            }

            return (true, null, cartonSizeIds, isAdminRole);
        }

        // Helper method to get the filtered inventory query
        private IQueryable<Inventory> GetFilteredInventoryQuery(InventorySearchDto inventorySearch,
            string stockGroupIds, bool isAdminRole)
        {
            // 1) Start with everything
            var query = context.Inventories.AsQueryable();

            // 2) Existing stock‐group / carton‐size filter and if not admin role, filter by stock group
            if (!isAdminRole && !string.IsNullOrWhiteSpace(stockGroupIds))
            {
                var allowedCartonSizeIds = stockGroupIds
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .Select(id => Guid.TryParse(id, out var g) ? g : Guid.Empty)
                    .Where(g => g != Guid.Empty)
                    .ToList();

                if (allowedCartonSizeIds.Count != 0)
                {
                    query = query
                        .Join(context.Products,
                            inv => inv.ProductId,
                            prod => prod.Id,
                            (inv, prod) => new { inv, prod })
                        .Where(x => allowedCartonSizeIds.Contains(x.prod.CartonSizeId))
                        .Select(x => x.inv);
                }
            }

            // 3) Filter by explicit ProductId list
            if (inventorySearch.ProductId?.Any() == true)
            {
                var prodGuids = inventorySearch.ProductId
                    .Select(id => Guid.TryParse(id, out var g) ? g : Guid.Empty)
                    .Where(g => g != Guid.Empty)
                    .ToList();

                if (prodGuids.Any())
                {
                    query = query.Where(inv => prodGuids.Contains(inv.ProductId));
                }
            }

            // 4) Filter by WarehouseId
            if (inventorySearch.WarehouseId?.Any() == true)
            {
                var whGuids = inventorySearch.WarehouseId
                    .Select(id => Guid.TryParse(id, out var g) ? g : Guid.Empty)
                    .Where(g => g != Guid.Empty)
                    .ToList();

                if (whGuids.Any())
                {
                    query = query.Where(inv => whGuids.Contains(inv.WarehouseId));
                }
            }

            // 5) Filter by CurrentLocationId
            if (inventorySearch.LocationId?.Any() == true)
            {
                var locGuids = inventorySearch.LocationId
                    .Select(id => Guid.TryParse(id, out var g) ? g : Guid.Empty)
                    .Where(g => g != Guid.Empty)
                    .ToList();

                if (locGuids.Count != 0)
                {
                    query = query.Where(inv => locGuids.Contains(inv.CurrentLocationId));
                }
            }

            // 6) Filter by ClientCode on the Product
            if (inventorySearch.ClientCodeId?.Any() == true)
            {
                // Parse string codes into enum values
                var clientCodeIds = inventorySearch.ClientCodeId
                    .Select(id => Guid.TryParse(id, out var g) ? g : Guid.Empty)
                    .Where(g => g != Guid.Empty)
                    .ToList();

                if (clientCodeIds.Any())
                {
                    query = query
                        .Join(context.Products,
                            inv => inv.ProductId,
                            prod => prod.Id,
                            (inv, prod) => new { inv, prod })
                        .Where(x => clientCodeIds.Contains(x.prod.ClientCodeId))
                        .Select(x => x.inv);
                }
            }

            return query;
        }

        private static string GetEnumDescription<T>(T enumValue) where T : Enum
        {
            var fieldInfo = enumValue.GetType().GetField(enumValue.ToString());
            var attributes =
                (DescriptionAttribute[])fieldInfo!.GetCustomAttributes(typeof(DescriptionAttribute), false);

            return attributes.Length > 0 ? attributes[0].Description : enumValue.ToString();
        }
    }
}