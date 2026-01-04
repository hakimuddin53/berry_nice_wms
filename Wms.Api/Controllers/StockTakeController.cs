using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;
using Wms.Api.Dto.StockTake;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/stock-take")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class StockTakeController(
        IInventoryService inventoryService,
        IRunningNumberService runningNumberService,
        ApplicationDbContext context,
        IMapper mapper) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] StockTakeCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var request = new StockTakeRequest
            {
                WarehouseId = dto.WarehouseId,
                Remark = dto.Remark,
                Items = dto.Items.Select(i => new StockTakeItemRequest
                {
                    ProductId = i.ProductId,
                    ScannedBarcode = string.IsNullOrWhiteSpace(i.ScannedBarcode) ? null : i.ScannedBarcode,
                    CountedQuantity = i.CountedQuantity,
                    Remark = i.Remark
                }).ToList()
            };

            var created = await inventoryService.StockTakeAsync(request);
            var details = await context.StockTakes
                .Include(st => st.Items)
                    .ThenInclude(i => i.Product)
                .FirstAsync(st => st.Id == created.Id);

            var outDto = mapper.Map<StockTakeDetailsDto>(details);
            await PopulateStockTakeDetailsAsync(new[] { outDto });

            return Ok(outDto);
        }

        [HttpPost("search")]
        public async Task<IActionResult> SearchAsync([FromBody] StockTakeSearchDto searchDto)
        {
            searchDto ??= new StockTakeSearchDto();

            var query = context.StockTakes
                .Include(st => st.Items)
                    .ThenInclude(i => i.Product)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchDto.Search))
            {
                var term = searchDto.Search.Trim();
                query = query.Where(st =>
                    st.Number.Contains(term) ||
                    st.Items.Any(i => (i.Product != null && i.Product.ProductCode.Contains(term)) ||
                                      (!string.IsNullOrWhiteSpace(i.ScannedBarcode) && i.ScannedBarcode.Contains(term))));
            }

            var ordered = query.OrderByDescending(st => st.TakenAt);
            var totalCount = await ordered.CountAsync();

            var items = await ordered
                .Skip((searchDto.Page - 1) * searchDto.PageSize)
                .Take(searchDto.PageSize)
                .ToListAsync();

            var paged = new PagedList<StockTake>(items, searchDto.Page, searchDto.PageSize);
            var dto = mapper.Map<PagedListDto<StockTakeDetailsDto>>(paged);
            dto.TotalCount = totalCount;

            await PopulateStockTakeDetailsAsync(dto.Data);

            return Ok(dto);
        }

        [HttpPost("count")]
        public async Task<IActionResult> CountAsync([FromBody] StockTakeSearchDto searchDto)
        {
            searchDto ??= new StockTakeSearchDto();

            var query = context.StockTakes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchDto.Search))
            {
                var term = searchDto.Search.Trim();
                query = query.Where(st =>
                    st.Number.Contains(term));
            }

            var count = await query.CountAsync();
            return Ok(count);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var stockTake = await context.StockTakes
                .Include(st => st.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(st => st.Id == id);

            if (stockTake == null)
            {
                return NotFound();
            }

            var dto = mapper.Map<StockTakeDetailsDto>(stockTake);
            await PopulateStockTakeDetailsAsync(new[] { dto });

            return Ok(dto);
        }

        private async Task PopulateStockTakeDetailsAsync(IEnumerable<StockTakeDetailsDto> dtos)
        {
            var list = dtos.Where(d => d != null).ToList();
            if (list.Count == 0)
            {
                return;
            }

            var warehouseIds = list.Select(d => d.WarehouseId).Distinct().ToList();
            var warehouseLabels = warehouseIds.Count == 0
                ? new Dictionary<Guid, string>()
                : await context.Lookups
                    .Where(l => warehouseIds.Contains(l.Id))
                    .ToDictionaryAsync(l => l.Id, l => l.Label);

            var productIds = list
                .SelectMany(d => d.Items.Where(i => i.ProductId.HasValue).Select(i => i.ProductId!.Value))
                .Distinct()
                .ToList();

            var productCodes = productIds.Count == 0
                ? new Dictionary<Guid, string>()
                : await context.Products
                    .Where(p => productIds.Contains(p.ProductId))
                    .ToDictionaryAsync(p => p.ProductId, p => p.ProductCode);

            foreach (var dto in list)
            {
                dto.WarehouseName = warehouseLabels.TryGetValue(dto.WarehouseId, out var label)
                    ? label
                    : string.Empty;

                foreach (var item in dto.Items)
                {
                    if (item.ProductId.HasValue &&
                        string.IsNullOrWhiteSpace(item.ProductCode) &&
                        productCodes.TryGetValue(item.ProductId.Value, out var code))
                    {
                        item.ProductCode = code;
                    }
                }
            }
        }
    }
}
