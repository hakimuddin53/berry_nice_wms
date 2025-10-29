using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
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
                                                        e.Purchaser.Contains(stockInSearch.search));

            var orderedStockIns = stockIns.OrderByDescending(e => e.CreatedAt);



            var result = orderedStockIns.Skip((stockInSearch.Page - 1) * stockInSearch.PageSize).Take(stockInSearch.PageSize).ToList();
            PagedList<StockIn> pagedResult = new PagedList<StockIn>(result, stockInSearch.Page, stockInSearch.PageSize);

            var stockInDtos = autoMapperService.Map<PagedListDto<StockInDetailsDto>>(pagedResult);
            await AssignWarehouseLabelsAsync(stockInDtos.Data);
            
            return Ok(stockInDtos);
        }
         
        [HttpPost("count", Name = "CountStockInsAsync")]     
        public async Task<IActionResult> CountStockInsAsync([FromBody] StockInSearchDto stockInSearch)
        {
            var stockIns = await service.GetAllAsync(e =>
                                                        e.Number.Contains(stockInSearch.search) ||
                                                        e.SellerInfo.Contains(stockInSearch.search) ||
                                                        e.Purchaser.Contains(stockInSearch.search));

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
            await AssignWarehouseLabelsAsync(new[] { stockInDtos });

            return Ok(stockInDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockInCreateUpdateDto stockInCreateUpdateDto)
        {   
            string stockInNumber = await runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKIN);
        
            stockInCreateUpdateDto.Number = stockInNumber;
            var stockInDtos = autoMapperService.Map<StockIn>(stockInCreateUpdateDto);
            stockInDtos.Id = Guid.NewGuid();
            stockInDtos.Location = string.Empty;

            NormalizeStockInItems(stockInDtos);

            await EnrichStockInItemsAsync(stockInDtos, allowLookupByCode: true);
            await EnsureProductsForStockInAsync(stockInDtos);

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
            stockIn.Location = string.Empty;

            NormalizeStockInItems(stockIn);

            await EnrichStockInItemsAsync(stockIn, allowLookupByCode: true);

            await service.UpdateAsync(stockIn);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await service.DeleteAsync(id);
            return NoContent();
        }

        private async Task AssignWarehouseLabelsAsync(IEnumerable<StockInDetailsDto> stockIns)
        {
            if (stockIns == null)
            {
                return;
            }

            var stockInList = stockIns.Where(s => s != null).ToList();
            if (stockInList.Count == 0)
            {
                return;
            }

            var warehouseIds = stockInList
                .Select(s => s.WarehouseId)
                .Where(id => id != Guid.Empty)
                .Distinct()
                .ToList();

            var lookupLabels = warehouseIds.Count == 0
                ? new Dictionary<Guid, string>()
                : await context.Lookups
                    .Where(l => warehouseIds.Contains(l.Id))
                    .ToDictionaryAsync(l => l.Id, l => l.Label);

            foreach (var dto in stockInList)
            {
                dto.WarehouseLabel = lookupLabels.TryGetValue(dto.WarehouseId, out var label)
                    ? label
                    : string.Empty;
            }
        }

        private async Task EnrichStockInItemsAsync(StockIn? stockIn, bool allowLookupByCode = false)
        {
            if (stockIn?.StockInItems == null || stockIn.StockInItems.Count == 0 || !allowLookupByCode)
            {
                return;
            }

            var productCodes = stockIn.StockInItems
                .Select(item => item.ProductCode)
                .Where(code => !string.IsNullOrWhiteSpace(code))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            if (productCodes.Count == 0)
            {
                return;
            }

            var query = context.Products.AsQueryable();

            var products = await query
                .Where(p => productCodes.Contains(p.ProductCode))
                .Select(p => new ProductSnapshot(
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

            var productsByCode = products.ToDictionary(p => p.ProductCode, StringComparer.OrdinalIgnoreCase);

            foreach (var item in stockIn.StockInItems)
            {
                if (!productsByCode.TryGetValue(item.ProductCode, out var product))
                {
                    continue;
                }

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

        private async Task EnsureProductsForStockInAsync(StockIn? stockIn)
        {
            if (stockIn?.StockInItems == null || stockIn.StockInItems.Count == 0)
            {
                return;
            }

            var productCodes = stockIn.StockInItems
                .Select(item => item.ProductCode?.Trim())
                .Where(code => !string.IsNullOrWhiteSpace(code))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            if (productCodes.Count == 0)
            {
                throw new InvalidOperationException("Each stock-in item must include a product code.");
            }

            var existingProducts = await context.Products
                .Where(p => productCodes.Contains(p.ProductCode))
                .ToDictionaryAsync(p => p.ProductCode, StringComparer.OrdinalIgnoreCase);

            foreach (var item in stockIn.StockInItems)
            {
                var normalizedCode = item.ProductCode?.Trim();
                if (string.IsNullOrWhiteSpace(normalizedCode))
                {
                    throw new InvalidOperationException("Each stock-in item must include a product code.");
                }

                item.ProductCode = normalizedCode;

                if (existingProducts.ContainsKey(normalizedCode))
                {
                    continue;
                }

                var product = new Product
                {
                    ProductId = Guid.NewGuid(),
                    ProductCode = normalizedCode,
                    CategoryId = item.CategoryId,
                    BrandId = item.BrandId,
                    Model = item.Model,
                    ColorId = item.ColorId,
                    StorageId = item.StorageId,
                    RamId = item.RamId,
                    ProcessorId = item.ProcessorId,
                    ScreenSizeId = item.ScreenSizeId,
                    CreatedDate = DateTime.UtcNow
                };

                await context.Products.AddAsync(product);
                existingProducts[normalizedCode] = product;
            }
        }
    }
}
