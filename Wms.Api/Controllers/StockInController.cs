using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;
using Wms.Api.Dto.StockIn.StockInCreateUpdate;
using Wms.Api.Dto.StockIn.StockInDetails;
using Wms.Api.Dto.StockIn.StockInSearch;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/stock-in")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class StockInController(
        IService<StockIn> service,
        IMapper autoMapperService,
        ApplicationDbContext context,
        IRunningNumberService runningNumberService,
        IInventoryService inventoryService)
        : ControllerBase
    {
        [HttpPost("search", Name = "SearchStockInsAsync")]
        public async Task<IActionResult> SearchStockInsAsync([FromBody] StockInSearchDto stockInSearch)
        {
            var stockIns = await service.GetAllAsync(e =>
                                                        e.Number.Contains(stockInSearch.search) ||
                                                        e.SellerInfo.Contains(stockInSearch.search) ||
                                                        e.Purchaser.Contains(stockInSearch.search) ||
                                                        e.Location.Contains(stockInSearch.search));

            var orderedStockIns = stockIns.OrderByDescending(e => e.CreatedAt);



            var result = orderedStockIns.Skip((stockInSearch.Page - 1) * stockInSearch.PageSize).Take(stockInSearch.PageSize).ToList();
            PagedList<StockIn> pagedResult = new PagedList<StockIn>(result, stockInSearch.Page, stockInSearch.PageSize);

            var stockInDtos = autoMapperService.Map<PagedListDto<StockInDetailsDto>>(pagedResult);
            
            return Ok(stockInDtos);
        }
         
        [HttpPost("count", Name = "CountStockInsAsync")]     
        public async Task<IActionResult> CountStockInsAsync([FromBody] StockInSearchDto stockInSearch)
        {
            var stockIns = await service.GetAllAsync(e =>
                                                        e.Number.Contains(stockInSearch.search) ||
                                                        e.SellerInfo.Contains(stockInSearch.search) ||
                                                        e.Purchaser.Contains(stockInSearch.search) ||
                                                        e.Location.Contains(stockInSearch.search));

            var stockInDtos = autoMapperService.Map<List<StockInDetailsDto>>(stockIns);
            return Ok(stockInDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var stockIn = await service.GetByIdAsync(id);
            if (stockIn == null)
                return NotFound();

            stockIn.StockInItems = await context.StockInItems
                .Where(x => x.StockInId == stockIn.Id)
                .Include(x => x.StockInItemRemarks)
                .ToListAsync();

            await EnrichStockInItemsAsync(stockIn, allowLookupByCode: true);

            var stockInDtos = autoMapperService.Map<StockInDetailsDto>(stockIn);   

            return Ok(stockInDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockInCreateUpdateDto stockInCreateUpdateDto)
        {   
            string stockInNumber = await runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKIN);
        
            stockInCreateUpdateDto.Number = stockInNumber;
            var stockInDtos = autoMapperService.Map<StockIn>(stockInCreateUpdateDto);
            stockInDtos.Id = Guid.NewGuid();

            NormalizeStockInItems(stockInDtos);

            await EnrichStockInItemsAsync(stockInDtos);

            await service.AddAsync(stockInDtos!, false);


            await inventoryService.StockInAsync(stockInDtos!);


            return CreatedAtAction(nameof(GetById), new { id = stockInDtos?.Id }, stockInDtos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] StockInCreateUpdateDto stockInCreateUpdate)
        {
            var stockIn = await context.StockIns
                .Include(s => s.StockInItems)
                    .ThenInclude(i => i.StockInItemRemarks)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (stockIn == null)
                return NotFound();

            autoMapperService.Map(stockInCreateUpdate, stockIn);

            NormalizeStockInItems(stockIn);

            await EnrichStockInItemsAsync(stockIn);

            await service.UpdateAsync(stockIn);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await service.DeleteAsync(id);
            return NoContent();
        }

        private async Task EnrichStockInItemsAsync(StockIn? stockIn, bool allowLookupByCode = false)
        {
            if (stockIn?.StockInItems == null || stockIn.StockInItems.Count == 0)
            {
                return;
            }

            var productIds = stockIn.StockInItems
                .Where(item => item.ProductId.HasValue && item.ProductId.Value != Guid.Empty)
                .Select(item => item.ProductId!.Value)
                .Distinct()
                .ToList();

            var productCodes = allowLookupByCode
                ? stockIn.StockInItems
                    .Where(item => (!item.ProductId.HasValue || item.ProductId.Value == Guid.Empty) && !string.IsNullOrWhiteSpace(item.ProductCode))
                    .Select(item => item.ProductCode)
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToList()
                : new List<string>();

            var query = context.Products.AsQueryable();

            Dictionary<Guid, ProductSnapshot> productsById = new();
            if (productIds.Count > 0)
            {
                productsById = await query
                    .Where(p => productIds.Contains(p.ProductId))
                    .Select(p => new ProductSnapshot(
                        p.ProductId,
                        p.ProductCode,
                        p.CategoryId,
                        p.BrandId,
                        p.Model,
                        p.ColorId,
                        p.StorageId,
                        p.RamId,
                        p.ProcessorId,
                        p.ScreenSizeId))
                    .ToDictionaryAsync(p => p.ProductId);
            }

            Dictionary<string, ProductSnapshot> productsByCode = new(StringComparer.OrdinalIgnoreCase);

            if (allowLookupByCode && productCodes.Count > 0)
            {
                var products = await query
                    .Where(p => productCodes.Contains(p.ProductCode))
                    .Select(p => new ProductSnapshot(
                        p.ProductId,
                        p.ProductCode,
                        p.CategoryId,
                        p.BrandId,
                        p.Model,
                        p.ColorId,
                        p.StorageId,
                        p.RamId,
                        p.ProcessorId,
                        p.ScreenSizeId))
                    .ToListAsync();

                foreach (var product in products)
                {
                    productsByCode[product.ProductCode] = product;
                }
            }

            foreach (var item in stockIn.StockInItems)
            {
                ProductSnapshot? product = null;

                if (item.ProductId.HasValue && productsById.TryGetValue(item.ProductId.Value, out var byId))
                {
                    product = byId;
                }
                else if (allowLookupByCode && productsByCode.TryGetValue(item.ProductCode, out var byCode))
                {
                    product = byCode;
                }

                if (product is null)
                {
                    continue;
                }

                item.ProductId = product.ProductId;
                item.ProductCode = product.ProductCode;
                item.CategoryId = product.CategoryId;
                item.BrandId = product.BrandId;
                item.Model = product.Model;
                item.ColorId = product.ColorId;
                item.StorageId = product.StorageId;
                item.RamId = product.RamId;
                item.ProcessorId = product.ProcessorId;
                item.ScreenSizeId = product.ScreenSizeId;
            }
        }

        private record ProductSnapshot(
            Guid ProductId,
            string ProductCode,
            Guid CategoryId,
            Guid? BrandId,
            string? Model,
            Guid? ColorId,
            Guid? StorageId,
            Guid? RamId,
            Guid? ProcessorId,
            Guid? ScreenSizeId);

        private static void NormalizeStockInItems(StockIn? stockIn)
        {
            if (stockIn?.StockInItems == null)
            {
                return;
            }

            foreach (var item in stockIn.StockInItems)
            {
                if (item.Id == Guid.Empty)
                {
                    item.Id = Guid.NewGuid();
                }

                item.StockInId = stockIn.Id;

                if (item.StockInItemRemarks == null || item.StockInItemRemarks.Count == 0)
                {
                    continue;
                }

                var remarks = item.StockInItemRemarks
                    .Where(r => !string.IsNullOrWhiteSpace(r.Remark))
                    .ToList();

                item.StockInItemRemarks = remarks;

                foreach (var remark in remarks)
                {
                    if (remark.Id == Guid.Empty)
                    {
                        remark.Id = Guid.NewGuid();
                    }

                    remark.StockInItemId = item.Id;
                }
            }
        }
    }
}
