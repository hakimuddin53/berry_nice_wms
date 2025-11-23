using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.Inventory;
using Wms.Api.Dto.PagedList;

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

            var stockInMovementsQuery =
                from item in context.StockInItems
                join stockIn in context.StockIns on item.StockInId equals stockIn.Id
                join product in context.Products on item.ProductId equals product.ProductId
                select new
                {
                    product.ProductId,
                    product.ProductCode,
                    product.Model,
                    MovementDate = stockIn.DateOfPurchase,
                    MovementType = "STOCKIN",
                    ReferenceNumber = stockIn.Number,
                    QuantityChange = item.ReceiveQuantity,
                    product.CostPrice,
                    product.AgentPrice,
                    product.DealerPrice,
                    product.RetailPrice
                };

            var invoiceMovementsQuery =
                from item in context.InvoiceItems
                join invoice in context.Invoices on item.InvoiceId equals invoice.Id
                join product in context.Products on item.ProductId equals product.ProductId into productJoin
                from product in productJoin.DefaultIfEmpty()
                where item.ProductId != null
                select new
                {
                    ProductId = item.ProductId!.Value,
                    ProductCode = item.ProductCode ?? (product != null ? product.ProductCode : string.Empty),
                    Model = product != null ? product.Model : null,
                    MovementDate = invoice.DateOfSale,
                    MovementType = "INVOICE",
                    ReferenceNumber = invoice.Number,
                    QuantityChange = -item.Quantity,
                    CostPrice = product != null ? product.CostPrice : null,
                    AgentPrice = product != null ? product.AgentPrice : null,
                    DealerPrice = product != null ? product.DealerPrice : null,
                    RetailPrice = product != null ? product.RetailPrice : null
                };

            var combinedQuery = stockInMovementsQuery.Concat(invoiceMovementsQuery);

            if (search.ProductId.HasValue)
            {
                combinedQuery = combinedQuery.Where(x => x.ProductId == search.ProductId.Value);
            }

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var term = search.Search.Trim();
                combinedQuery = combinedQuery.Where(x =>
                    x.ProductCode.Contains(term) ||
                    (x.Model != null && x.Model.Contains(term)) ||
                    x.ReferenceNumber.Contains(term));
            }

            var materialized = await combinedQuery
                .OrderBy(x => x.MovementDate)
                .ThenBy(x => x.ReferenceNumber)
                .ThenBy(x => x.QuantityChange)
                .ToListAsync();

            var runningBalances = new Dictionary<Guid, int>();
            var computed = new List<InventoryAuditDto>(materialized.Count);

            foreach (var entry in materialized)
            {
                runningBalances.TryGetValue(entry.ProductId, out var current);
                current += entry.QuantityChange;
                runningBalances[entry.ProductId] = current;

                computed.Add(new InventoryAuditDto
                {
                    ProductId = entry.ProductId,
                    ProductCode = entry.ProductCode,
                    Model = entry.Model,
                    MovementDate = entry.MovementDate,
                    MovementType = entry.MovementType,
                    ReferenceNumber = entry.ReferenceNumber,
                    QuantityChange = entry.QuantityChange,
                    BalanceAfter = current,
                    CostPrice = entry.CostPrice,
                    AgentPrice = entry.AgentPrice,
                    DealerPrice = entry.DealerPrice,
                    RetailPrice = entry.RetailPrice
                });
            }

            // Order for display (most recent first) then paginate
            var orderedForDisplay = computed
                .OrderByDescending(x => x.MovementDate)
                .ThenByDescending(x => x.ReferenceNumber)
                .ToList();

            var skip = (search.Page - 1) * search.PageSize;
            var dtoItems = orderedForDisplay.Skip(skip).Take(search.PageSize).ToList();

            var paged = new PagedListDto<InventoryAuditDto>
            {
                CurrentPage = search.Page,
                PageSize = search.PageSize,
                TotalCount = computed.Count,
                Data = dtoItems
            };

            return Ok(paged);
        }

        [HttpPost("summary")]
        public async Task<IActionResult> GetSummaryAsync([FromBody] InventorySummarySearchDto search)
        {
            search ??= new InventorySummarySearchDto();

            var incoming = await context.StockInItems
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
