using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.Inventory;
using Wms.Api.Dto.PagedList;
using Wms.Api.Dto.Product;
using Wms.Api.Model;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class InventoryController(ApplicationDbContext context) : ControllerBase
    {
        [HttpPost("audit")]
        public async Task<IActionResult> GetAuditAsync([FromBody] InventoryAuditSearchDto search)
        {
            search ??= new InventoryAuditSearchDto();

            var inventoryQuery =
                from inv in context.Inventories
                join product in context.Products on inv.ProductId equals product.ProductId into productJoin
                from product in productJoin.DefaultIfEmpty()
                join sr in context.StockRecieves on inv.StockRecieveId equals sr.Id into srJoin
                from sr in srJoin.DefaultIfEmpty()
                join invc in context.Invoices on inv.InvoiceId equals invc.Id into invoiceJoin
                from invc in invoiceJoin.DefaultIfEmpty()
                join warehouse in context.Lookups on inv.WarehouseId equals warehouse.Id into warehouseJoin
                from warehouse in warehouseJoin.DefaultIfEmpty()
                select new
                {
                    inv,
                    product,
                    StockRecieveNumber = sr != null ? sr.Number : string.Empty,
                    InvoiceNumber = invc != null ? invc.Number : string.Empty,
                    MovementDate = inv.CreatedAt,
                    WarehouseLabel = warehouse != null ? warehouse.Label : string.Empty
                };

            if (search.ProductId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.inv.ProductId == search.ProductId.Value);
            }

            if (!string.IsNullOrWhiteSpace(search.Model))
            {
                var modelTerm = search.Model.Trim();
                inventoryQuery = inventoryQuery.Where(x =>
                    x.product != null &&
                    x.product.Model != null &&
                    x.product.Model.Contains(modelTerm));
            }

            if (search.WarehouseId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.inv.WarehouseId == search.WarehouseId.Value);
            }

            if (search.LocationId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.product != null && x.product.LocationId == search.LocationId.Value);
            }

            if (search.CategoryId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.product != null && x.product.CategoryId == search.CategoryId.Value);
            }

            if (search.BrandId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.product != null && x.product.BrandId == search.BrandId.Value);
            }

            if (search.ColorId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.product != null && x.product.ColorId == search.ColorId.Value);
            }

            if (search.StorageId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.product != null && x.product.StorageId == search.StorageId.Value);
            }

            if (search.RamId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.product != null && x.product.RamId == search.RamId.Value);
            }

            if (search.ProcessorId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.product != null && x.product.ProcessorId == search.ProcessorId.Value);
            }

            if (search.ScreenSizeId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.product != null && x.product.ScreenSizeId == search.ScreenSizeId.Value);
            }

            if (search.GradeId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.product != null && x.product.GradeId == search.GradeId.Value);
            }

            if (search.RegionId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.product != null && x.product.RegionId == search.RegionId.Value);
            }

            if (search.NewOrUsedId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.product != null && x.product.NewOrUsedId == search.NewOrUsedId.Value);
            }

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var term = search.Search.Trim();
                inventoryQuery = inventoryQuery.Where(x =>
                    (x.product != null && x.product.ProductCode.Contains(term)) ||
                    (!string.IsNullOrEmpty(x.StockRecieveNumber) && x.StockRecieveNumber.Contains(term)) ||
                    (!string.IsNullOrEmpty(x.InvoiceNumber) && x.InvoiceNumber.Contains(term)) ||
                    (x.product != null && x.product.Model != null && x.product.Model.Contains(term)));
            }

            var latestIdsQuery = inventoryQuery
                .GroupBy(x => x.inv.ProductId)
                .Select(g => g
                    .OrderByDescending(x => x.MovementDate)
                    .ThenByDescending(x => x.inv.Id)
                    .Select(x => x.inv.Id)
                    .First());

            var latestQuery = inventoryQuery
                .Join(latestIdsQuery, row => row.inv.Id, id => id, (row, _) => row)
                .Where(row => row.inv.NewBalance > 0);

            var totalCount = await latestQuery.CountAsync();

            var pagedItems = await latestQuery
                .OrderByDescending(x => x.MovementDate)
                .ThenByDescending(x => x.inv.Id)
                .Skip((search.Page - 1) * search.PageSize)
                .Take(search.PageSize)
                .ToListAsync();

            var dtoItems = pagedItems.Select(x =>
            {
                var movementType = Enum.GetName(typeof(TransactionTypeEnum), x.inv.TransactionType) ?? x.inv.TransactionType.ToString();
                var referenceNumber = !string.IsNullOrEmpty(x.StockRecieveNumber)
                    ? x.StockRecieveNumber
                    : !string.IsNullOrEmpty(x.InvoiceNumber)
                        ? x.InvoiceNumber
                        : (x.inv.StockTransferId != Guid.Empty ? x.inv.StockTransferId.ToString() : string.Empty);

                return new InventoryAuditDto
                {
                    ProductId = x.inv.ProductId,
                    ProductCode = x.product?.ProductCode ?? string.Empty,
                    Model = x.product?.Model,
                    AgeDays = x.product == null
                        ? 0
                        : Math.Max(0, (int)Math.Floor((DateTime.UtcNow - x.product.CreatedDate).TotalDays)),
                    WarehouseId = x.inv.WarehouseId,
                    WarehouseLabel = x.WarehouseLabel,
                    MovementDate = x.MovementDate,
                    MovementType = movementType,
                    ReferenceNumber = referenceNumber,
                    QuantityIn = x.inv.QuantityIn,
                    QuantityOut = x.inv.QuantityOut,
                    OldBalance = x.inv.OldBalance,
                    NewBalance = x.inv.NewBalance,
                    CostPrice = x.product?.CostPrice
                };
            }).ToList();

            var paged = new PagedListDto<InventoryAuditDto>
            {
                CurrentPage = search.Page,
                PageSize = search.PageSize,
                TotalCount = totalCount,
                Data = dtoItems
            };

            return Ok(paged);
        }

        [HttpPost("invoiced-report")]
        public async Task<IActionResult> GetInvoicedReportAsync([FromBody] InvoicedProductReportSearchDto search)
        {
            search ??= new InvoicedProductReportSearchDto();

            var reportQuery =
                from item in context.InvoiceItems
                join invoice in context.Invoices on item.InvoiceId equals invoice.Id
                join product in context.Products on item.ProductId equals product.ProductId into productJoin
                from product in productJoin.DefaultIfEmpty()
                join warehouse in context.Lookups on invoice.WarehouseId equals warehouse.Id into warehouseJoin
                from warehouse in warehouseJoin.DefaultIfEmpty()
                join location in context.Lookups on product.LocationId equals location.Id into locationJoin
                from location in locationJoin.DefaultIfEmpty()
                select new
                {
                    item,
                    invoice,
                    product,
                    WarehouseLabel = warehouse != null ? warehouse.Label : string.Empty,
                    LocationLabel = location != null ? location.Label : string.Empty
                };

            if (search.FromDate.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.invoice.DateOfSale >= search.FromDate.Value.Date);
            }

            if (search.ToDate.HasValue)
            {
                var endDate = search.ToDate.Value.Date.AddDays(1).AddTicks(-1);
                reportQuery = reportQuery.Where(x => x.invoice.DateOfSale <= endDate);
            }

            if (search.ProductId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.item.ProductId == search.ProductId.Value);
            }

            if (!string.IsNullOrWhiteSpace(search.Model))
            {
                var modelTerm = search.Model.Trim();
                reportQuery = reportQuery.Where(x =>
                    x.product != null &&
                    x.product.Model != null &&
                    x.product.Model.Contains(modelTerm));
            }

            if (search.WarehouseId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.invoice.WarehouseId == search.WarehouseId.Value);
            }

            if (search.LocationId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.LocationId == search.LocationId.Value);
            }

            if (search.CategoryId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.CategoryId == search.CategoryId.Value);
            }

            if (search.BrandId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.BrandId == search.BrandId.Value);
            }

            if (search.ColorId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.ColorId == search.ColorId.Value);
            }

            if (search.StorageId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.StorageId == search.StorageId.Value);
            }

            if (search.RamId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.RamId == search.RamId.Value);
            }

            if (search.ProcessorId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.ProcessorId == search.ProcessorId.Value);
            }

            if (search.ScreenSizeId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.ScreenSizeId == search.ScreenSizeId.Value);
            }

            if (search.GradeId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.GradeId == search.GradeId.Value);
            }

            if (search.RegionId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.RegionId == search.RegionId.Value);
            }

            if (search.NewOrUsedId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.NewOrUsedId == search.NewOrUsedId.Value);
            }

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var term = search.Search.Trim();
                reportQuery = reportQuery.Where(x =>
                    (x.product != null && x.product.ProductCode.Contains(term)) ||
                    (x.product != null && x.product.Model != null && x.product.Model.Contains(term)) ||
                    x.invoice.Number.Contains(term));
            }

            var totalCount = await reportQuery.CountAsync();

            var pagedItems = await reportQuery
                .OrderByDescending(x => x.invoice.DateOfSale)
                .ThenByDescending(x => x.invoice.Number)
                .Skip((search.Page - 1) * search.PageSize)
                .Take(search.PageSize)
                .ToListAsync();

            var dtoItems = pagedItems.Select(x => new InvoicedProductReportRowDto
            {
                InvoiceId = x.invoice.Id,
                InvoiceNumber = x.invoice.Number,
                DateOfSale = x.invoice.DateOfSale,
                ProductId = x.item.ProductId,
                ProductCode = x.product?.ProductCode ?? string.Empty,
                Model = x.product?.Model,
                WarehouseId = x.invoice.WarehouseId,
                WarehouseLabel = x.WarehouseLabel,
                LocationId = x.product?.LocationId,
                LocationLabel = x.LocationLabel,
                Quantity = x.item.Quantity,
                UnitPrice = x.item.UnitPrice,
                TotalPrice = x.item.TotalPrice > 0 ? x.item.TotalPrice : x.item.UnitPrice * x.item.Quantity
            }).ToList();

            var paged = new PagedListDto<InvoicedProductReportRowDto>
            {
                CurrentPage = search.Page,
                PageSize = search.PageSize,
                TotalCount = totalCount,
                Data = dtoItems
            };

            return Ok(paged);
        }

        [HttpPost("invoiced-report-total")]
        public async Task<IActionResult> GetInvoicedReportTotalAsync([FromBody] InvoicedProductReportSearchDto search)
        {
            search ??= new InvoicedProductReportSearchDto();

            var reportQuery =
                from item in context.InvoiceItems
                join invoice in context.Invoices on item.InvoiceId equals invoice.Id
                join product in context.Products on item.ProductId equals product.ProductId into productJoin
                from product in productJoin.DefaultIfEmpty()
                join warehouse in context.Lookups on invoice.WarehouseId equals warehouse.Id into warehouseJoin
                from warehouse in warehouseJoin.DefaultIfEmpty()
                join location in context.Lookups on product.LocationId equals location.Id into locationJoin
                from location in locationJoin.DefaultIfEmpty()
                select new
                {
                    item,
                    invoice,
                    product,
                    WarehouseLabel = warehouse != null ? warehouse.Label : string.Empty,
                    LocationLabel = location != null ? location.Label : string.Empty
                };

            if (search.FromDate.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.invoice.DateOfSale >= search.FromDate.Value.Date);
            }

            if (search.ToDate.HasValue)
            {
                var endDate = search.ToDate.Value.Date.AddDays(1).AddTicks(-1);
                reportQuery = reportQuery.Where(x => x.invoice.DateOfSale <= endDate);
            }

            if (search.ProductId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.item.ProductId == search.ProductId.Value);
            }

            if (!string.IsNullOrWhiteSpace(search.Model))
            {
                var modelTerm = search.Model.Trim();
                reportQuery = reportQuery.Where(x =>
                    x.product != null &&
                    x.product.Model != null &&
                    x.product.Model.Contains(modelTerm));
            }

            if (search.WarehouseId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.invoice.WarehouseId == search.WarehouseId.Value);
            }

            if (search.LocationId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.LocationId == search.LocationId.Value);
            }

            if (search.CategoryId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.CategoryId == search.CategoryId.Value);
            }

            if (search.BrandId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.BrandId == search.BrandId.Value);
            }

            if (search.ColorId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.ColorId == search.ColorId.Value);
            }

            if (search.StorageId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.StorageId == search.StorageId.Value);
            }

            if (search.RamId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.RamId == search.RamId.Value);
            }

            if (search.ProcessorId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.ProcessorId == search.ProcessorId.Value);
            }

            if (search.ScreenSizeId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.ScreenSizeId == search.ScreenSizeId.Value);
            }

            if (search.GradeId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.GradeId == search.GradeId.Value);
            }

            if (search.RegionId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.RegionId == search.RegionId.Value);
            }

            if (search.NewOrUsedId.HasValue)
            {
                reportQuery = reportQuery.Where(x => x.product != null && x.product.NewOrUsedId == search.NewOrUsedId.Value);
            }

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var term = search.Search.Trim();
                reportQuery = reportQuery.Where(x =>
                    (x.product != null && x.product.ProductCode.Contains(term)) ||
                    (x.product != null && x.product.Model != null && x.product.Model.Contains(term)) ||
                    x.invoice.Number.Contains(term));
            }

            var total = await reportQuery
                .Select(x => x.item.TotalPrice > 0 ? x.item.TotalPrice : x.item.UnitPrice * x.item.Quantity)
                .DefaultIfEmpty(0m)
                .SumAsync();

            return Ok(total);
        }

        [HttpPost("summary")]
        public async Task<IActionResult> GetSummaryAsync([FromBody] InventorySummarySearchDto search)
        {
            search ??= new InventorySummarySearchDto();

            // Latest inventory record per product (captures current warehouse and balance)
            var latestDatesQuery = context.Inventories
                .GroupBy(i => i.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    CreatedAt = g.Max(x => x.CreatedAt)
                });

            var latestIdsQuery =
                from inv in context.Inventories
                join latestDate in latestDatesQuery
                    on new { inv.ProductId, inv.CreatedAt } equals new { latestDate.ProductId, latestDate.CreatedAt }
                group inv by inv.ProductId into g
                select new
                {
                    ProductId = g.Key,
                    Id = g.Max(x => x.Id)
                };

            var baseQuery =
                from inv in context.Inventories
                join latest in latestIdsQuery
                    on new { inv.ProductId, inv.Id } equals new { latest.ProductId, latest.Id }
                join product in context.Products on inv.ProductId equals product.ProductId
                join warehouse in context.Lookups on inv.WarehouseId equals warehouse.Id into warehouseJoin
                from warehouse in warehouseJoin.DefaultIfEmpty()
                select new
                {
                    inv,
                    product,
                    WarehouseLabel = warehouse != null ? warehouse.Label : string.Empty
                };

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var term = search.Search.Trim();
                baseQuery = baseQuery.Where(x =>
                    x.product.ProductCode.Contains(term) ||
                    (x.product.Model != null && x.product.Model.Contains(term)));
            }

            if (search.WarehouseId.HasValue)
            {
                baseQuery = baseQuery.Where(x => x.inv.WarehouseId == search.WarehouseId.Value);
            }

            if (search.MinQuantity.HasValue)
            {
                baseQuery = baseQuery.Where(x => x.inv.NewBalance >= search.MinQuantity.Value);
            }

            var totalCount = await baseQuery.CountAsync();

            var pagedRows = await baseQuery
                .OrderBy(x => x.product.ProductCode)
                .Skip((search.Page - 1) * search.PageSize)
                .Take(search.PageSize)
                .ToListAsync();

            var summaryRows = pagedRows.Select(x => new InventorySummaryRowDto
            {
                ProductId = x.inv.ProductId,
                ProductCode = x.product.ProductCode,
                Model = x.product.Model,
                AvailableQuantity = x.inv.NewBalance,
                WarehouseId = x.inv.WarehouseId,
                WarehouseLabel = x.WarehouseLabel,
                CostPrice = x.product.CostPrice,
                AgentPrice = x.product.AgentPrice,
                DealerPrice = x.product.DealerPrice,
                RetailPrice = x.product.RetailPrice
            }).ToList();

            var paged = new PagedListDto<InventorySummaryRowDto>
            {
                CurrentPage = search.Page,
                PageSize = search.PageSize,
                TotalCount = totalCount,
                Data = summaryRows
            };

            return Ok(paged);
        }

        [HttpPut("summary/{productId:guid}/pricing")]
        public async Task<IActionResult> UpdatePricingAsync(Guid productId, [FromBody] UpdateProductPricingDto pricing)
        {
            var product = await context.Products.FirstOrDefaultAsync(p => p.ProductId == productId);
            if (product == null)
            {
                return NotFound();
            }

            product.CostPrice = pricing.CostPrice ?? product.CostPrice;
            product.AgentPrice = pricing.AgentPrice ?? product.AgentPrice;
            product.DealerPrice = pricing.DealerPrice ?? product.DealerPrice;
            product.RetailPrice = pricing.RetailPrice ?? product.RetailPrice;

            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("balance/{productId:guid}")]
        public async Task<IActionResult> UpdateBalanceAsync(Guid productId, [FromBody] UpdateInventoryBalanceDto balance)
        {
            var product = await context.Products.FirstOrDefaultAsync(p => p.ProductId == productId);
            if (product == null)
            {
                return NotFound();
            }

            product.Remark = balance.Remark;
            product.InternalRemark = balance.InternalRemark;
            product.AgentPrice = balance.AgentPrice;
            product.DealerPrice = balance.DealerPrice;
            product.RetailPrice = balance.RetailPrice;
            product.CostPrice = balance.CostPrice;
            if (balance.LocationId.HasValue)
            {
                product.LocationId = balance.LocationId.Value;
            }

            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("product/{productId:guid}/audit-log")]
        public async Task<IActionResult> GetProductAuditAsync(Guid productId)
        {
            var items = await context.ProductAuditLogs
                .Where(p => p.ProductId == productId)
                .OrderByDescending(p => p.ChangedAt)
                .ThenByDescending(p => p.Id)
                .Select(p => new ProductAuditLogDto
                {
                    Id = p.Id,
                    ProductId = p.ProductId,
                    PropertyName = p.PropertyName,
                    OldValue = p.OldValue,
                    NewValue = p.NewValue,
                    ChangedBy = p.ChangedBy,
                    ChangedAt = p.ChangedAt
                })
                .ToListAsync();

            return Ok(items);
        }
    }
}
