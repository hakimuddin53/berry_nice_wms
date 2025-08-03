using AutoMapper;
using DocumentFormat.OpenXml.Bibliography;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;
using Wms.Api.Dto.StockAdjustment.StockAdjustmentCreateUpdate; 
using Wms.Api.Dto.StockAdjustment.StockAdjustmentCreateUpdateDto;
using Wms.Api.Dto.StockAdjustment.StockAdjustmentSearch;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/stock-adjustment")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class StockAdjustmentController(
        IService<StockAdjustment> service,
        IMapper autoMapperService,
        IRunningNumberService runningNumberService,
        IInventoryService inventoryService,
        ApplicationDbContext context)
        : ControllerBase
    {
        [HttpPost("search", Name = "SearchStockAdjustmentsAsync")]
        public async Task<IActionResult> SearchStockAdjustmentsAsync([FromBody] StockAdjustmentSearchDto stockAdjustmentSearch)
        {    
            var stockAdjustments = await service.GetAllAsync(e => e.Number.Contains(stockAdjustmentSearch.search));

            var orderedstockAdjustments = stockAdjustments.OrderByDescending(e => e.CreatedAt);
            var result = orderedstockAdjustments.Skip((stockAdjustmentSearch.Page - 1) * stockAdjustmentSearch.PageSize).Take(stockAdjustmentSearch.PageSize).ToList();
            PagedList<StockAdjustment> pagedResult = new PagedList<StockAdjustment>(result, stockAdjustmentSearch.Page, stockAdjustmentSearch.PageSize);

            var stockAdjustmentDtos = autoMapperService.Map<PagedListDto<StockAdjustmentDetailsDto>>(pagedResult);
             

            return Ok(stockAdjustmentDtos);
        }

        [HttpPost("count", Name = "CountStockAdjustmentsAsync")]
        public async Task<IActionResult> CountStockInsAsync([FromBody] StockAdjustmentSearchDto stockAdjustmentSearch)
        {
            var stockAdjustments = await service.GetAllAsync(e => e.Number.Contains(stockAdjustmentSearch.search));

            var stockAdjustmentDtos = autoMapperService.Map<List<StockAdjustmentDetailsDto>>(stockAdjustments);
            return Ok(stockAdjustmentDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var stockAdjustment = await service.GetByIdAsync(id); 
            
            if (stockAdjustment == null)
                return NotFound();
            
            stockAdjustment.StockAdjustmentItems = context.StockAdjustmentItems.Where(x => x.StockAdjustmentId == stockAdjustment.Id).ToList();

            var stockAdjustmentDtos = autoMapperService.Map<StockAdjustmentDetailsDto>(stockAdjustment);
            
          
            return Ok(stockAdjustmentDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockAdjustmentCreateUpdateDto stockAdjustmentCreateUpdateDto)
        { 
            string stockAdjustmentNumber = await runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKADJUSTMENT);

            stockAdjustmentCreateUpdateDto.Number = stockAdjustmentNumber;
            var stockAdjustmentDtos = autoMapperService.Map<StockAdjustment>(stockAdjustmentCreateUpdateDto);

            await service.AddAsync(stockAdjustmentDtos!, false);
             
            await inventoryService.StockAdjustmentAsync(stockAdjustmentDtos!);


            return CreatedAtAction(nameof(GetById), new { id = stockAdjustmentDtos?.Id }, stockAdjustmentDtos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] StockAdjustmentCreateUpdateDto stockAdjustmentCreateUpdate)
        {
            var stockAdjustment = await service.GetByIdAsync(id);

            var stockAdjustmentDtos = autoMapperService.Map<StockAdjustmentDetailsDto>(stockAdjustment);
            if (stockAdjustmentDtos == null)
                return NotFound();

            autoMapperService.Map(stockAdjustmentCreateUpdate, stockAdjustment);


            await service.UpdateAsync(stockAdjustment);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await service.DeleteAsync(id);
            return NoContent();
        }
    }
}
