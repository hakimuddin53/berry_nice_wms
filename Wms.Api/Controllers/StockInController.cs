using System;
using System.Collections.Generic;
using System.Linq;
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
                .Include(x => x.Product)
                .ToListAsync();

            var stockInDtos = autoMapperService.Map<StockInDetailsDto>(stockIn);
            await AssignWarehouseLabelsAsync(new[] { stockInDtos });

            return Ok(stockInDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockInCreateUpdateDto stockInCreateUpdateDto)
        {   
            string stockInNumber = await runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKIN);
        
            var stockInDtos = autoMapperService.Map<StockIn>(stockInCreateUpdateDto);
            stockInDtos.Id = Guid.NewGuid();
            stockInDtos.Number = stockInNumber;
            stockInDtos.Location = string.Empty;

            NormalizeStockInItems(stockInDtos);

            await EnsureProductsForStockInAsync(stockInDtos, stockInCreateUpdateDto);

            await service.AddAsync(stockInDtos!, false);


            await inventoryService.StockInAsync(stockInDtos!);

            var createdDto = autoMapperService.Map<StockInDetailsDto>(stockInDtos);

            return CreatedAtAction(nameof(GetById), new { id = stockInDtos?.Id }, createdDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] StockInCreateUpdateDto stockInCreateUpdate)
        {
            var stockIn = await context.StockIns
                .Include(s => s.StockInItems!)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (stockIn == null)
                return NotFound();

            autoMapperService.Map(stockInCreateUpdate, stockIn);
            stockIn.Location = string.Empty;

            NormalizeStockInItems(stockIn);

            await EnsureProductsForStockInAsync(stockIn, stockInCreateUpdate);

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
            }
        }

        private async Task EnsureProductsForStockInAsync(StockIn? stockIn, StockInCreateUpdateDto? stockInDto)
        {
            if (stockIn?.StockInItems == null || stockIn.StockInItems.Count == 0 || stockInDto?.StockInItems == null)
            {
                return;
            }

            var entityItems = stockIn.StockInItems.ToList();
            var dtoItems = stockInDto.StockInItems.ToList();

            if (entityItems.Count != dtoItems.Count)
            {
                throw new InvalidOperationException("Stock-in items mismatch between payload and entity.");
            }

            var productIds = dtoItems
                .Where(item => item.ProductId.HasValue && item.ProductId.Value != Guid.Empty)
                .Select(item => item.ProductId!.Value)
                .Distinct()
                .ToList();

            var productCodes = dtoItems
                .Select(item => item.ProductCode?.Trim())
                .Where(code => !string.IsNullOrWhiteSpace(code))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            var products = await context.Products
                .Where(p => productIds.Contains(p.ProductId) || productCodes.Contains(p.ProductCode))
                .ToListAsync();

            var productsById = products.ToDictionary(p => p.ProductId);
            var productsByCode = products
                .Where(p => !string.IsNullOrWhiteSpace(p.ProductCode))
                .ToDictionary(p => p.ProductCode!, p => p, StringComparer.OrdinalIgnoreCase);

            // Remarks are simple strings now; no per-product remark catalog needed.

            for (int index = 0; index < entityItems.Count; index++)
            {
                var entityItem = entityItems[index];
                var dtoItem = dtoItems[index];

                var normalizedCode = dtoItem.ProductCode?.Trim();
                Product? product = null;

                if (dtoItem.ProductId.HasValue && dtoItem.ProductId.Value != Guid.Empty)
                {
                    productsById.TryGetValue(dtoItem.ProductId.Value, out product);
                    if (product == null)
                    {
                        product = await context.Products
                            .FirstOrDefaultAsync(p => p.ProductId == dtoItem.ProductId.Value);

                        if (product != null)
                        {
                            productsById[product.ProductId] = product;
                            if (!string.IsNullOrWhiteSpace(product.ProductCode))
                            {
                                productsByCode[product.ProductCode] = product;
                            }

                            // no remark maps
                        }
                    }
                }

                if (product == null && !string.IsNullOrWhiteSpace(normalizedCode))
                {
                    productsByCode.TryGetValue(normalizedCode, out product);
                }

                if (product == null)
                {
                    if (string.IsNullOrWhiteSpace(normalizedCode))
                    {
                        throw new InvalidOperationException("Each stock-in item must include a product code when product ID is not specified.");
                    }

                    var newProductId = dtoItem.ProductId.HasValue && dtoItem.ProductId.Value != Guid.Empty
                        ? dtoItem.ProductId.Value
                        : Guid.NewGuid();

                    product = new Product
                    {
                        ProductId = newProductId,
                        ProductCode = normalizedCode!,
                        CategoryId = dtoItem.CategoryId,
                        BrandId = dtoItem.BrandId,
                        Model = dtoItem.Model,
                        ColorId = dtoItem.ColorId,
                        StorageId = dtoItem.StorageId,
                        RamId = dtoItem.RamId,
                        ProcessorId = dtoItem.ProcessorId,
                        ScreenSizeId = dtoItem.ScreenSizeId,
                        RetailPrice = dtoItem.RetailSellingPrice,
                        DealerPrice = dtoItem.DealerSellingPrice,
                        AgentPrice = dtoItem.AgentSellingPrice,
                        CostPrice = dtoItem.Cost,
                        PrimarySerialNumber = string.IsNullOrWhiteSpace(dtoItem.PrimarySerialNumber) ? null : dtoItem.PrimarySerialNumber.Trim(),
                        ManufactureSerialNumber = string.IsNullOrWhiteSpace(dtoItem.ManufactureSerialNumber) ? null : dtoItem.ManufactureSerialNumber.Trim(),
                        Region = string.IsNullOrWhiteSpace(dtoItem.Region) ? null : dtoItem.Region.Trim(),
                        NewOrUsed = string.IsNullOrWhiteSpace(dtoItem.NewOrUsed) ? null : dtoItem.NewOrUsed.Trim(),
                        CreatedDate = DateTime.UtcNow
                    };

                    await context.Products.AddAsync(product);

                    productsById[product.ProductId] = product;
                    productsByCode[product.ProductCode] = product;
                }
                else
                {
                    if (!string.IsNullOrWhiteSpace(normalizedCode))
                    {
                        product.ProductCode = normalizedCode;
                        productsByCode[normalizedCode] = product;
                    }

                    product.CategoryId = dtoItem.CategoryId;
                    product.BrandId = dtoItem.BrandId;
                    product.Model = dtoItem.Model;
                    product.ColorId = dtoItem.ColorId;
                    product.StorageId = dtoItem.StorageId;
                    product.RamId = dtoItem.RamId;
                    product.ProcessorId = dtoItem.ProcessorId;
                    product.ScreenSizeId = dtoItem.ScreenSizeId;
                    product.RetailPrice = dtoItem.RetailSellingPrice ?? product.RetailPrice;
                    product.DealerPrice = dtoItem.DealerSellingPrice ?? product.DealerPrice;
                    product.AgentPrice = dtoItem.AgentSellingPrice ?? product.AgentPrice;
                    product.CostPrice = dtoItem.Cost ?? product.CostPrice;

                    if (!string.IsNullOrWhiteSpace(dtoItem.PrimarySerialNumber))
                    {
                        product.PrimarySerialNumber = dtoItem.PrimarySerialNumber.Trim();
                    }

                    if (!string.IsNullOrWhiteSpace(dtoItem.ManufactureSerialNumber))
                    {
                        product.ManufactureSerialNumber = dtoItem.ManufactureSerialNumber.Trim();
                    }

                    if (!string.IsNullOrWhiteSpace(dtoItem.Region))
                    {
                        product.Region = dtoItem.Region.Trim();
                    }

                    if (!string.IsNullOrWhiteSpace(dtoItem.NewOrUsed))
                    {
                        product.NewOrUsed = dtoItem.NewOrUsed.Trim();
                    }

                    // no per-product remarks
                }

                entityItem.ProductId = product.ProductId;
                entityItem.Product = product;
                // Assign free-text remark from DTO to entity
                entityItem.Remark = dtoItem.Remark?.Trim();
            }
        }

    }
}
