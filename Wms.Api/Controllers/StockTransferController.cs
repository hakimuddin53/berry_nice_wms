using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;
using Wms.Api.Dto.StockTransfer;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/stock-transfer")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class StockTransferController(
        IInventoryService inventoryService,
        IRunningNumberService runningNumberService,
        ApplicationDbContext context,
        IMapper mapper) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> TransferAsync([FromBody] StockTransferCreateDto request)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var transferNumber = await runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKTRANSFER);

            var transferRequest = new StockTransferRequest
            {
                Number = transferNumber,
                FromWarehouseId = request.FromWarehouseId,
                ToWarehouseId = request.ToWarehouseId,
                Items = request.Items.Select(i => new StockTransferItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    Remark = i.Remark
                }).ToList()
            };

            var created = await inventoryService.StockTransferAsync(transferRequest);
            var dto = mapper.Map<List<StockTransferDetailsDto>>(created);
            await PopulateTransferDetailsAsync(dto);

            return Created(string.Empty, new { number = transferNumber, items = dto });
        }

        [HttpPost("search")]
        public async Task<IActionResult> SearchAsync([FromBody] StockTransferSearchDto searchDto)
        {
            searchDto ??= new StockTransferSearchDto();

            var query = context.StockTransfers
                .Include(st => st.Product)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchDto.Search))
            {
                var term = searchDto.Search.Trim();
                query = query.Where(st =>
                    st.Number.Contains(term) ||
                    (st.Product != null && st.Product.ProductCode.Contains(term)));
            }

            var ordered = query.OrderByDescending(st => st.CreatedAt);
            var totalCount = await ordered.CountAsync();

            var items = await ordered
                .Skip((searchDto.Page - 1) * searchDto.PageSize)
                .Take(searchDto.PageSize)
                .ToListAsync();

            var paged = new PagedList<StockTransfer>(items, searchDto.Page, searchDto.PageSize);
            var dto = mapper.Map<PagedListDto<StockTransferDetailsDto>>(paged);
            dto.TotalCount = totalCount;

            await PopulateTransferDetailsAsync(dto.Data);

            return Ok(dto);
        }

        [HttpPost("count")]
        public async Task<IActionResult> CountAsync([FromBody] StockTransferSearchDto searchDto)
        {
            searchDto ??= new StockTransferSearchDto();

            var query = context.StockTransfers
                .Include(st => st.Product)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchDto.Search))
            {
                var term = searchDto.Search.Trim();
                query = query.Where(st =>
                    st.Number.Contains(term) ||
                    (st.Product != null && st.Product.ProductCode.Contains(term)));
            }

            var count = await query.CountAsync();
            return Ok(count);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var transfer = await context.StockTransfers
                .Include(st => st.Product)
                .FirstOrDefaultAsync(st => st.Id == id);

            if (transfer == null)
            {
                return NotFound();
            }

            var dto = mapper.Map<StockTransferDetailsDto>(transfer);
            await PopulateTransferDetailsAsync(new[] { dto });

            return Ok(dto);
        }

        private async Task PopulateTransferDetailsAsync(IEnumerable<StockTransferDetailsDto> dtos)
        {
            var list = dtos.Where(d => d != null).ToList();
            if (list.Count == 0)
            {
                return;
            }

            var warehouseIds = list
                .SelectMany(d => new[] { d.FromWarehouseId, d.ToWarehouseId })
                .Where(id => id != Guid.Empty)
                .Distinct()
                .ToList();

            var warehouseLabels = warehouseIds.Count == 0
                ? new Dictionary<Guid, string>()
                : await context.Lookups
                    .Where(l => warehouseIds.Contains(l.Id))
                    .ToDictionaryAsync(l => l.Id, l => l.Label);

            var productIds = list.Select(d => d.ProductId).Distinct().ToList();
            var products = productIds.Count == 0
                ? new Dictionary<Guid, string>()
                : await context.Products
                    .Where(p => productIds.Contains(p.ProductId))
                    .ToDictionaryAsync(p => p.ProductId, p => p.ProductCode);

            foreach (var dto in list)
            {
                dto.FromWarehouseName = warehouseLabels.TryGetValue(dto.FromWarehouseId, out var fromLabel)
                    ? fromLabel
                    : string.Empty;

                dto.ToWarehouseName = warehouseLabels.TryGetValue(dto.ToWarehouseId, out var toLabel)
                    ? toLabel
                    : string.Empty;

                if (string.IsNullOrWhiteSpace(dto.ProductCode) && products.TryGetValue(dto.ProductId, out var code))
                {
                    dto.ProductCode = code;
                }
            }
        }
    }
}
