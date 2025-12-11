using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.Inventory;
using Wms.Api.Dto.PagedList;
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

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var term = search.Search.Trim();
                inventoryQuery = inventoryQuery.Where(x =>
                    (x.product != null && x.product.ProductCode.Contains(term)) ||
                    (!string.IsNullOrEmpty(x.StockRecieveNumber) && x.StockRecieveNumber.Contains(term)) ||
                    (!string.IsNullOrEmpty(x.InvoiceNumber) && x.InvoiceNumber.Contains(term)) ||
                    (x.product != null && x.product.Model != null && x.product.Model.Contains(term)));
            }

            var totalCount = await inventoryQuery.CountAsync();

            var pagedItems = await inventoryQuery
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

        [HttpPost("summary")]
        public async Task<IActionResult> GetSummaryAsync([FromBody] InventorySummarySearchDto search)
        {
            search ??= new InventorySummarySearchDto();

            var incoming = await context.StockRecieveItems
                .GroupBy(i => i.ProductId)
                .Select(g => new { ProductId = g.Key, Quantity = g.Sum(x => x.ReceiveQuantity) })
                .ToDictionaryAsync(x => x.ProductId, x => x.Quantity);

            var outgoing = await context.InvoiceItems
                .Where(i => i.ProductId != null)
                .GroupBy(i => i.ProductId!.Value)
                .Select(g => new { ProductId = g.Key, Quantity = g.Sum(x => x.Quantity) })
                .ToDictionaryAsync(x => x.ProductId, x => x.Quantity);

            var productsQuery = context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var term = search.Search.Trim();
                productsQuery = productsQuery.Where(p =>
                    p.ProductCode.Contains(term) ||
                    (p.Model != null && p.Model.Contains(term)));
            }

            var totalCount = await productsQuery.CountAsync();

            var products = await productsQuery
                .OrderBy(p => p.ProductCode)
                .Skip((search.Page - 1) * search.PageSize)
                .Take(search.PageSize)
                .ToListAsync();

            var summaryRows = products.Select(p =>
            {
                incoming.TryGetValue(p.ProductId, out var received);
                outgoing.TryGetValue(p.ProductId, out var sold);
                var available = received - sold;

                return new InventorySummaryRowDto
                {
                    ProductId = p.ProductId,
                    ProductCode = p.ProductCode,
                    Model = p.Model,
                    AvailableQuantity = available,
                    CostPrice = p.CostPrice,
                    AgentPrice = p.AgentPrice,
                    DealerPrice = p.DealerPrice,
                    RetailPrice = p.RetailPrice
                };
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
    }
}

