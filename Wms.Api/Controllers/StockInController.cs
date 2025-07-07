using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;
using Wms.Api.Dto.StockIn.StockInCreateUpdate;
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
                                                        e.PONumber.Contains(stockInSearch.search));


            var result = stockIns.Skip((stockInSearch.Page - 1) * stockInSearch.PageSize).Take(stockInSearch.PageSize).ToList();
            PagedList<StockIn> pagedResult = new PagedList<StockIn>(result, stockInSearch.Page, stockInSearch.PageSize);

            var stockInDtos = autoMapperService.Map<PagedListDto<StockInDetailsDto>>(pagedResult);
            
            return Ok(stockInDtos);
        }
         
        [HttpPost("count", Name = "CountStockInsAsync")]     
        public async Task<IActionResult> CountStockInsAsync([FromBody] StockInSearchDto stockInSearch)
        {
            var stockIns = await service.GetAllAsync(e =>
                                                        e.Number.Contains(stockInSearch.search) ||
                                                        e.PONumber.Contains(stockInSearch.search));

            var stockInDtos = autoMapperService.Map<List<StockInDetailsDto>>(stockIns);
            return Ok(stockInDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var stockIn = await service.GetByIdAsync(id);
            if (stockIn == null)
                return NotFound();

            stockIn.StockInItems = context.StockInItems.Where(x => x.StockInId == stockIn.Id).ToList();

            var stockInDtos = autoMapperService.Map<StockInDetailsDto>(stockIn);   

            return Ok(stockInDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockInCreateUpdateDto stockInCreateUpdateDto)
        {   
            string stockInNumber = await runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKIN);
        
            stockInCreateUpdateDto.Number = stockInNumber;
            var stockInDtos = autoMapperService.Map<StockIn>(stockInCreateUpdateDto); 
          

            await service.AddAsync(stockInDtos!);
             

            await inventoryService.StockInAsync(stockInDtos!);


            return CreatedAtAction(nameof(GetById), new { id = stockInDtos?.Id }, stockInDtos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] StockInCreateUpdateDto stockInCreateUpdate)
        {
            var stockIn = await service.GetByIdAsync(id);

            var stockInDtos = autoMapperService.Map<StockInDetailsDto>(stockIn);
            if (stockInDtos == null)
                return NotFound();

            autoMapperService.Map(stockInCreateUpdate, stockIn);

            await service.UpdateAsync(stockIn);
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
