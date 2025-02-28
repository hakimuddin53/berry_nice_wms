using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public class StockInController : ControllerBase
    {
        private readonly IService<StockIn> _service;
        private readonly IRunningNumberService _runningNumberService;
        private readonly IInventoryService _inventoryService;
        private readonly IMapper _autoMapperService;
        private readonly ApplicationDbContext _context;

        public StockInController(IService<StockIn> service,
            IMapper autoMapperService, ApplicationDbContext context, 
            IRunningNumberService runningNumberService, IInventoryService inventoryService)
        {
            _service = service;
            _autoMapperService = autoMapperService;
            _context = context;
            _runningNumberService = runningNumberService;
            _inventoryService = inventoryService;
        }

        [HttpPost("search", Name = "SearchStockInsAsync")]
        public async Task<IActionResult> SearchStockInsAsync([FromBody] StockInSearchDto stockInSearch)
        {  
            var stockIns = await _service.GetAllAsync(e => e.Number.Contains(stockInSearch.search));

            var result = stockIns.Skip((stockInSearch.Page - 1) * stockInSearch.PageSize).Take(stockInSearch.PageSize).ToList();
            PagedList<StockIn> pagedResult = new PagedList<StockIn>(result, stockInSearch.Page, stockInSearch.PageSize);

            var stockInDtos = _autoMapperService.Map<PagedListDto<StockInDetailsDto>>(pagedResult);

            foreach (var stock in stockInDtos.Data)
            {
                stock.Warehouse = _context.Warehouses?.Where(x => x.Id == stock.WarehouseId)?.FirstOrDefault()?.Name ?? "";
                stock.Location = _context.Locations?.Where(x => x.Id == stock.LocationId)?.FirstOrDefault()?.Name ?? "";
            }
            return Ok(stockInDtos);
        }
         
        [HttpPost("count", Name = "CountStockInsAsync")]     
        public async Task<IActionResult> CountStockInsAsync([FromBody] StockInSearchDto stockInSearch)
        {
            var stockIns = await _service.GetAllAsync(e => e.Number.Contains(stockInSearch.search));
             
            var stockInDtos = _autoMapperService.Map<List<StockInDetailsDto>>(stockIns);
            return Ok(stockInDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var stockIn = await _service.GetByIdAsync(id);
            if (stockIn == null)
                return NotFound();

            stockIn.StockInItems = _context.StockInItems.Where(x => x.StockInId == stockIn.Id).ToList();

            var stockInDtos = _autoMapperService.Map<StockInDetailsDto>(stockIn); 

            stockInDtos.Warehouse = _context.Warehouses?.Where(x => x.Id == stockInDtos.WarehouseId)?.FirstOrDefault()?.Name ?? "";
            stockInDtos.Location = _context.Locations?.Where(x => x.Id == stockInDtos.LocationId)?.FirstOrDefault()?.Name ?? "";

            foreach(var stockInItem in stockInDtos.StockInItems!)
            {
                stockInItem.Product = _context.Products?.Where(x => x.Id == stockInItem.ProductId)?.FirstOrDefault()?.Name ?? "";
            }

            return Ok(stockInDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockInCreateUpdateDto stockInCreateUpdateDto)
        {   
            string stockInNumber = await _runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKIN);
        
            stockInCreateUpdateDto.Number = stockInNumber;
            var stockInDtos = _autoMapperService.Map<StockIn>(stockInCreateUpdateDto); 
             
            foreach (var item in stockInDtos?.StockInItems ?? [])
            {
                item.StockInItemNumber = await _runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKINITEM);
            } 

            await _service.AddAsync(stockInDtos!);
             

            await _inventoryService.StockInAsync(stockInDtos!);


            return CreatedAtAction(nameof(GetById), new { id = stockInDtos?.Id }, stockInDtos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] StockInCreateUpdateDto stockInCreateUpdate)
        {
            var stockIn = await _service.GetByIdAsync(id);

            var stockInDtos = _autoMapperService.Map<StockInDetailsDto>(stockIn);
            if (stockInDtos == null)
                return NotFound();

            _autoMapperService.Map(stockInCreateUpdate, stockIn);

            await _service.UpdateAsync(stockIn);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
