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
using Wms.Api.Dto.StockRecieve.StockRecieveCreateUpdate;
using Wms.Api.Dto.StockRecieve.StockRecieveDetails;
using Wms.Api.Dto.StockRecieve.StockRecieveSearch;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/stock-receive")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class StockRecieveController(
        IService<StockRecieve> service,
        IMapper autoMapperService,
        ApplicationDbContext context,
        IRunningNumberService runningNumberService,
        IInventoryService inventoryService)
        : ControllerBase
    {
        [HttpPost("search", Name = "SearchStockRecievesAsync")]
        public async Task<IActionResult> SearchStockRecievesAsync([FromBody] StockRecieveSearchDto StockRecieveSearch)
        {
            var StockRecieves = await service.GetAllAsync(e =>
                                                        e.Number.Contains(StockRecieveSearch.search) ||
                                                        e.SellerInfo.Contains(StockRecieveSearch.search) ||
                                                        e.Purchaser.Contains(StockRecieveSearch.search));

            var orderedStockRecieves = StockRecieves.OrderByDescending(e => e.CreatedAt);



            var result = orderedStockRecieves.Skip((StockRecieveSearch.Page - 1) * StockRecieveSearch.PageSize).Take(StockRecieveSearch.PageSize).ToList();
            PagedList<StockRecieve> pagedResult = new PagedList<StockRecieve>(result, StockRecieveSearch.Page, StockRecieveSearch.PageSize);

            var StockRecieveDtos = autoMapperService.Map<PagedListDto<StockRecieveDetailsDto>>(pagedResult);
            await AssignWarehouseLabelsAsync(StockRecieveDtos.Data);
            
            return Ok(StockRecieveDtos);
        }
         
        [HttpPost("count", Name = "CountStockRecievesAsync")]     
        public async Task<IActionResult> CountStockRecievesAsync([FromBody] StockRecieveSearchDto StockRecieveSearch)
        {
            var StockRecieves = await service.GetAllAsync(e =>
                                                        e.Number.Contains(StockRecieveSearch.search) ||
                                                        e.SellerInfo.Contains(StockRecieveSearch.search) ||
                                                        e.Purchaser.Contains(StockRecieveSearch.search));

            var StockRecieveDtos = autoMapperService.Map<List<StockRecieveDetailsDto>>(StockRecieves);
            return Ok(StockRecieveDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var StockRecieve = await service.GetByIdAsync(id);
            if (StockRecieve == null)
                return NotFound();

            StockRecieve.StockRecieveItems = await context.StockRecieveItems
                .Where(x => x.StockRecieveId == StockRecieve.Id)
                .Include(x => x.Product)
                    .ThenInclude(p => p.Grade)
                .Include(x => x.Product)
                    .ThenInclude(p => p.Region)
                .Include(x => x.Product)
                    .ThenInclude(p => p.NewOrUsed)
                .ToListAsync();

            var StockRecieveDtos = autoMapperService.Map<StockRecieveDetailsDto>(StockRecieve);
            await AssignWarehouseLabelsAsync(new[] { StockRecieveDtos });

            return Ok(StockRecieveDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockRecieveCreateUpdateDto StockRecieveCreateUpdateDto)
        {   
            string StockRecieveNumber = await runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKRECEIVE);
        
            var StockRecieveDtos = autoMapperService.Map<StockRecieve>(StockRecieveCreateUpdateDto);
            StockRecieveDtos.Id = Guid.NewGuid();
            StockRecieveDtos.Number = StockRecieveNumber;

            NormalizeStockRecieveItems(StockRecieveDtos);

            await EnsureProductsForStockRecieveAsync(StockRecieveDtos, StockRecieveCreateUpdateDto);

            await service.AddAsync(StockRecieveDtos!, false);


            await inventoryService.StockRecieveAsync(StockRecieveDtos!);

            var createdDto = autoMapperService.Map<StockRecieveDetailsDto>(StockRecieveDtos);

            return CreatedAtAction(nameof(GetById), new { id = StockRecieveDtos?.Id }, createdDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] StockRecieveCreateUpdateDto StockRecieveCreateUpdate)
        {
            var StockRecieve = await context.StockRecieves
                .Include(s => s.StockRecieveItems!)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (StockRecieve == null)
                return NotFound();

            autoMapperService.Map(StockRecieveCreateUpdate, StockRecieve);

            NormalizeStockRecieveItems(StockRecieve);

            await EnsureProductsForStockRecieveAsync(StockRecieve, StockRecieveCreateUpdate);

            var incomingItems = StockRecieve.StockRecieveItems?.ToList() ?? new List<StockRecieveItem>();
            var incomingItemIds = incomingItems.Select(item => item.Id).ToHashSet();

            var existingItemIds = await context.StockRecieveItems
                .Where(item => item.StockRecieveId == StockRecieve.Id)
                .Select(item => item.Id)
                .ToListAsync();

            foreach (var item in incomingItems)
            {
                if (!existingItemIds.Contains(item.Id))
                {
                    if (item.Id == Guid.Empty)
                    {
                        item.Id = Guid.NewGuid();
                    }

                    context.StockRecieveItems.Add(item);
                }
                else
                {
                    context.Entry(item).State = EntityState.Modified;
                }
            }

            context.Entry(StockRecieve).State = EntityState.Modified;

            await context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await service.DeleteAsync(id);
            return NoContent();
        }

        private async Task AssignWarehouseLabelsAsync(IEnumerable<StockRecieveDetailsDto> StockRecieves)
        {
            if (StockRecieves == null)
            {
                return;
            }

            var StockRecieveList = StockRecieves.Where(s => s != null).ToList();
            if (StockRecieveList.Count == 0)
            {
                return;
            }

            var warehouseIds = StockRecieveList
                .Select(s => s.WarehouseId)
                .Where(id => id != Guid.Empty)
                .Distinct()
                .ToList();

            var lookupLabels = warehouseIds.Count == 0
                ? new Dictionary<Guid, string>()
                : await context.Lookups
                    .Where(l => warehouseIds.Contains(l.Id))
                    .ToDictionaryAsync(l => l.Id, l => l.Label);

            foreach (var dto in StockRecieveList)
            {
                dto.WarehouseLabel = lookupLabels.TryGetValue(dto.WarehouseId, out var label)
                    ? label
                    : string.Empty;
            }
        }

        private static void NormalizeStockRecieveItems(StockRecieve? StockRecieve)
        {
            if (StockRecieve?.StockRecieveItems == null)
            {
                return;
            }

            foreach (var item in StockRecieve.StockRecieveItems)
            {
                if (item.Id == Guid.Empty)
                {
                    item.Id = Guid.NewGuid();
                }

                item.StockRecieveId = StockRecieve.Id;
            }
        }

        private async Task EnsureProductsForStockRecieveAsync(StockRecieve? StockRecieve, StockRecieveCreateUpdateDto? StockRecieveDto)
        {
            if (StockRecieve?.StockRecieveItems == null || StockRecieve.StockRecieveItems.Count == 0 || StockRecieveDto?.StockRecieveItems == null)
            {
                return;
            }

            var entityItems = StockRecieve.StockRecieveItems.ToList();
            var dtoItems = StockRecieveDto.StockRecieveItems.ToList();

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

            // Remarks captured on stock receive item are persisted on the Product.

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
                        normalizedCode = await runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.PRODUCT);
                        dtoItem.ProductCode = normalizedCode;
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
                        GradeId = dtoItem.GradeId,
                        LocationId = dtoItem.LocationId,
                        RetailPrice = dtoItem.RetailSellingPrice,
                        DealerPrice = dtoItem.DealerSellingPrice,
                        AgentPrice = dtoItem.AgentSellingPrice,
                        CostPrice = dtoItem.Cost,
                        SerialNumber = string.IsNullOrWhiteSpace(dtoItem.SerialNumber) ? null : dtoItem.SerialNumber.Trim(),                        
                        RegionId = dtoItem.RegionId.HasValue && dtoItem.RegionId.Value != Guid.Empty ? dtoItem.RegionId : null,
                        NewOrUsedId = dtoItem.NewOrUsedId.HasValue && dtoItem.NewOrUsedId.Value != Guid.Empty ? dtoItem.NewOrUsedId : null,
                        CreatedDate = DateTime.UtcNow,
                        Remark = string.IsNullOrWhiteSpace(dtoItem.Remark) ? null : dtoItem.Remark.Trim(),
                        InternalRemark = string.IsNullOrWhiteSpace(dtoItem.InternalRemark) ? null : dtoItem.InternalRemark.Trim()
                    };

                    await context.Products.AddAsync(product);

                    productsById[product.ProductId] = product;
                    productsByCode[product.ProductCode] = product;
                }
                else
                {
                    product.CategoryId = dtoItem.CategoryId;
                    product.BrandId = dtoItem.BrandId;
                    product.Model = dtoItem.Model;
                    product.ColorId = dtoItem.ColorId;
                    product.StorageId = dtoItem.StorageId;
                    product.RamId = dtoItem.RamId;
                    product.ProcessorId = dtoItem.ProcessorId;
                    product.ScreenSizeId = dtoItem.ScreenSizeId;
                    product.GradeId = dtoItem.GradeId ?? product.GradeId;
                    if (dtoItem.LocationId != Guid.Empty)
                    {
                        product.LocationId = dtoItem.LocationId;
                    }
                    product.RetailPrice = dtoItem.RetailSellingPrice ?? product.RetailPrice;
                    product.DealerPrice = dtoItem.DealerSellingPrice ?? product.DealerPrice;
                    product.AgentPrice = dtoItem.AgentSellingPrice ?? product.AgentPrice;
                    product.CostPrice = dtoItem.Cost ?? product.CostPrice;

                    if (!string.IsNullOrWhiteSpace(dtoItem.SerialNumber))
                    {
                        product.SerialNumber = dtoItem.SerialNumber.Trim();
                    }                     

                    product.RegionId = dtoItem.RegionId.HasValue && dtoItem.RegionId.Value != Guid.Empty
                        ? dtoItem.RegionId
                        : null;

                    product.NewOrUsedId = dtoItem.NewOrUsedId.HasValue && dtoItem.NewOrUsedId.Value != Guid.Empty
                        ? dtoItem.NewOrUsedId
                        : null;

                    if (!string.IsNullOrWhiteSpace(dtoItem.Remark))
                    {
                        product.Remark = dtoItem.Remark.Trim();
                    }

                    if (!string.IsNullOrWhiteSpace(dtoItem.InternalRemark))
                    {
                        product.InternalRemark = dtoItem.InternalRemark.Trim();
                    }
                }

                entityItem.ProductId = product.ProductId;
                entityItem.Product = product;
            }
        }

    }
}
