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
                join location in context.Lookups on product.LocationId equals location.Id into locationJoin
                from location in locationJoin.DefaultIfEmpty()
                join modelLookup in context.Lookups on product.ModelId equals modelLookup.Id into modelJoin
                from modelLookup in modelJoin.DefaultIfEmpty()
                select new
                {
                    inv,
                    product,
                    StockRecieveNumber = sr != null ? sr.Number : string.Empty,
                    DateOfPurchase = sr != null ? sr.DateOfPurchase : (DateTime?)null,
                    InvoiceNumber = invc != null ? invc.Number : string.Empty,
                    MovementDate = inv.CreatedAt,
                    WarehouseLabel = warehouse != null ? warehouse.Label : string.Empty,
                    LocationLabel = location != null ? location.Label : string.Empty,
                    ModelLabel = modelLookup != null ? modelLookup.Label : null
                };

            if (search.ProductId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x => x.inv.ProductId == search.ProductId.Value);
            }

            if (search.ModelId.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x =>
                    x.product != null && x.product.ModelId == search.ModelId.Value);
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

            if (search.BatteryHealth.HasValue)
            {
                inventoryQuery = inventoryQuery.Where(x =>
                    x.product != null && x.product.BatteryHealth == search.BatteryHealth.Value);
            }

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var term = search.Search.Trim();
                inventoryQuery = inventoryQuery.Where(x =>
                    (x.product != null && x.product.ProductCode.Contains(term)) ||
                    (!string.IsNullOrEmpty(x.ModelLabel) && x.ModelLabel.Contains(term)) ||
                    (!string.IsNullOrEmpty(x.StockRecieveNumber) && x.StockRecieveNumber.Contains(term)) ||
                    (!string.IsNullOrEmpty(x.InvoiceNumber) && x.InvoiceNumber.Contains(term)));
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

            var orderedItems = await latestQuery
                .OrderBy(x => x.ModelLabel ?? string.Empty)
                .ThenBy(x => x.product != null ? x.product.ProductCode : string.Empty)
                .ThenByDescending(x => x.MovementDate)
                .ThenByDescending(x => x.inv.Id)
                .ToListAsync();

            var totalCount = orderedItems.Count;

            var dtoItems = orderedItems.Select(x =>
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
                    ModelId = x.product?.ModelId,
                    ModelName = x.ModelLabel,
                    Model = x.ModelLabel,
                    CreatedAt = x.product?.CreatedDate ?? x.inv.CreatedAt,
                    AgeDays = x.product == null
                        ? 0
                        : Math.Max(
                            0,
                            (int)Math.Floor(
                                (DateTime.UtcNow - (x.DateOfPurchase ?? x.product.CreatedDate)).TotalDays)),
                    WarehouseId = x.inv.WarehouseId,
                    WarehouseLabel = x.WarehouseLabel,
                    MovementDate = x.MovementDate,
                    MovementType = movementType,
                    ReferenceNumber = referenceNumber,
                    QuantityIn = x.inv.QuantityIn,
                    QuantityOut = x.inv.QuantityOut,
                    OldBalance = x.inv.OldBalance,
                    NewBalance = x.inv.NewBalance,
                    CostPrice = x.product?.CostPrice,
                    BatteryHealth = x.product?.BatteryHealth,
                    RetailPrice = x.product?.RetailPrice,
                    DealerPrice = x.product?.DealerPrice,
                    AgentPrice = x.product?.AgentPrice,
                    Remark = x.product?.Remark,
                    InternalRemark = x.product?.InternalRemark,
                    LocationId = x.product?.LocationId,
                    LocationLabel = x.LocationLabel
                };
            }).ToList();

            var paged = new PagedListDto<InventoryAuditDto>
            {
                CurrentPage = 1,
                PageSize = totalCount,
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
                join model in context.Lookups on product.ModelId equals model.Id into modelJoin
                from model in modelJoin.DefaultIfEmpty()
                select new
                {
                    item,
                    invoice,
                    product,
                    WarehouseLabel = warehouse != null ? warehouse.Label : string.Empty,
                    LocationLabel = location != null ? location.Label : string.Empty,
                    ModelLabel = model != null ? model.Label : string.Empty
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
                    x.product.Model.Label.Contains(modelTerm));
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
                    (x.product != null && x.product.Model != null && x.product.Model.Label.Contains(term)) ||
                    x.invoice.Number.Contains(term));
            }

            var items = await reportQuery
                .OrderByDescending(x => x.invoice.DateOfSale)
                .ThenByDescending(x => x.invoice.Number)
                .ToListAsync();

            var totalCount = items.Count;

            var dtoItems = items.Select(x => new InvoicedProductReportRowDto
            {
                InvoiceId = x.invoice.Id,
                InvoiceNumber = x.invoice.Number,
                DateOfSale = x.invoice.DateOfSale,
                ProductId = x.item.ProductId,
                ProductCode = x.product?.ProductCode ?? string.Empty,
                Model = !string.IsNullOrEmpty(x.ModelLabel) ? x.ModelLabel : x.product?.Model?.Label,
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
                CurrentPage = 1,
                PageSize = totalCount,
                TotalCount = totalCount,
                Data = dtoItems
            };

            return Ok(paged);
        }

        [HttpPost("purchase-quality-report")]
        public async Task<IActionResult> GetPurchaseQualityReportAsync([FromBody] PurchaseQualityReportSearchDto search)
        {
            search ??= new PurchaseQualityReportSearchDto();

            var purchaseQuery =
                from item in context.StockRecieveItems
                join receive in context.StockRecieves on item.StockRecieveId equals receive.Id
                join product in context.Products on item.ProductId equals product.ProductId
                select new
                {
                    receive.Purchaser,
                    receive.DateOfPurchase,
                    item.ProductId,
                    item.ReceiveQuantity,
                    CostPrice = product.CostPrice ?? 0m
                };

            if (search.FromDate.HasValue)
            {
                purchaseQuery = purchaseQuery.Where(x => x.DateOfPurchase >= search.FromDate.Value.Date);
            }

            if (search.ToDate.HasValue)
            {
                var endDate = search.ToDate.Value.Date.AddDays(1).AddTicks(-1);
                purchaseQuery = purchaseQuery.Where(x => x.DateOfPurchase <= endDate);
            }

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var term = search.Search.Trim();
                purchaseQuery = purchaseQuery.Where(x => x.Purchaser.Contains(term));
            }

            var purchaseByProduct = await purchaseQuery
                .GroupBy(x => new { x.Purchaser, x.ProductId })
                .Select(g => new
                {
                    g.Key.Purchaser,
                    g.Key.ProductId,
                    PurchaseTotal = g.Sum(x => x.CostPrice * x.ReceiveQuantity)
                })
                .ToListAsync();

            var salesQuery =
                from item in context.InvoiceItems
                join invoice in context.Invoices on item.InvoiceId equals invoice.Id
                where item.ProductId != null
                select new
                {
                    ProductId = item.ProductId.Value,
                    invoice.DateOfSale,
                    item.UnitPrice,
                    item.TotalPrice,
                    item.Quantity
                };

            if (search.FromDate.HasValue)
            {
                salesQuery = salesQuery.Where(x => x.DateOfSale >= search.FromDate.Value.Date);
            }

            if (search.ToDate.HasValue)
            {
                var endDate = search.ToDate.Value.Date.AddDays(1).AddTicks(-1);
                salesQuery = salesQuery.Where(x => x.DateOfSale <= endDate);
            }

            var salesByProduct = await salesQuery
                .GroupBy(x => x.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    SoldTotal = g.Sum(x => x.TotalPrice > 0 ? x.TotalPrice : x.UnitPrice * x.Quantity)
                })
                .ToListAsync();

            var salesMap = salesByProduct.ToDictionary(x => x.ProductId, x => x.SoldTotal);

            var reportRows = purchaseByProduct
                .Select(p => new
                {
                    p.Purchaser,
                    p.PurchaseTotal,
                    SoldTotal = salesMap.TryGetValue(p.ProductId, out var sold) ? sold : 0m
                })
                .GroupBy(x => x.Purchaser)
                .Select(g => new PurchaseQualityReportRowDto
                {
                    Purchaser = g.Key,
                    PurchaseTotal = g.Sum(x => x.PurchaseTotal),
                    SoldTotal = g.Sum(x => x.SoldTotal),
                    Profit = g.Sum(x => x.SoldTotal) - g.Sum(x => x.PurchaseTotal)
                })
                .OrderBy(x => x.Purchaser)
                .ToList();

            var totalCount = reportRows.Count;

            var pagedItems = reportRows
                .Skip((search.Page - 1) * search.PageSize)
                .Take(search.PageSize)
                .ToList();

            var paged = new PagedListDto<PurchaseQualityReportRowDto>
            {
                CurrentPage = search.Page,
                PageSize = search.PageSize,
                TotalCount = totalCount,
                Data = pagedItems
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
                    x.product.Model.Label.Contains(modelTerm));
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
                    (x.product != null && x.product.Model != null && x.product.Model.Label.Contains(term)) ||
                    x.invoice.Number.Contains(term));
            }

            // Use a nullable projection so EF can translate the ternary and still return 0 when no rows match.
            var total = await reportQuery
                .Select(x => (decimal?)(x.item.TotalPrice > 0
                    ? x.item.TotalPrice
                    : x.item.UnitPrice * (decimal)x.item.Quantity))
                .SumAsync() ?? 0m;

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
                    (x.product.Model != null && x.product.Model.Label.Contains(term)));
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
                Model = x.product.Model != null ? x.product.Model.Label : null,
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

        [HttpPut("pricing/{productId:guid}/retail")]
        public async Task<IActionResult> UpdateRetailPriceAsync(Guid productId, [FromBody] UpdateRetailPriceDto dto)
        {
            var product = await context.Products.FirstOrDefaultAsync(p => p.ProductId == productId);
            if (product == null)
            {
                return NotFound();
            }

            product.RetailPrice = dto.RetailPrice;
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
            product.BatteryHealth = balance.BatteryHealth ?? product.BatteryHealth;
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
