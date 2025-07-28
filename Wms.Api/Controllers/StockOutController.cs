using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;
using Wms.Api.Dto.StockOut.StockOutCreateUpdate; 
using Wms.Api.Dto.StockOut.StockOutCreateUpdateDto;
using Wms.Api.Dto.StockOut.StockOutSearch;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/stock-out")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class StockOutController : ControllerBase
    {
        private readonly IService<StockOut> _service;
        private readonly IRunningNumberService _runningNumberService;
        private readonly IStockReservationService _stockReservationService;
        private readonly IInventoryService _inventoryService;
        private readonly IMapper _autoMapperService;
        private readonly ApplicationDbContext _context;

        public StockOutController(IService<StockOut> service,
            IMapper autoMapperService, IRunningNumberService runningNumberService, IInventoryService inventoryService,
            ApplicationDbContext context, IStockReservationService stockReservationService)
        {
            _service = service;
            _autoMapperService = autoMapperService;
            _runningNumberService = runningNumberService;
            _inventoryService = inventoryService;
            _context = context;
            _stockReservationService = stockReservationService;
        }

        [HttpPost("search", Name = "SearchStockOutsAsync")]
        public async Task<IActionResult> SearchStockOutsAsync([FromBody] StockOutSearchDto stockOutSearch)
        {     
            var stockOuts = await _service.GetAllAsync(e =>
                                                       e.Number.Contains(stockOutSearch.search) ||
                                                       e.DONumber.Contains(stockOutSearch.search));

            var orderedStockOuts = stockOuts.OrderByDescending(e => e.CreatedAt);

            var result = orderedStockOuts.Skip((stockOutSearch.Page - 1) * stockOutSearch.PageSize).Take(stockOutSearch.PageSize).ToList();
            PagedList<StockOut> pagedResult = new PagedList<StockOut>(result, stockOutSearch.Page, stockOutSearch.PageSize);

            var stockOutDtos = _autoMapperService.Map<PagedListDto<StockOutDetailsDto>>(pagedResult);
             

            return Ok(stockOutDtos);
        }

        [HttpPost("count", Name = "CountStockOutsAsync")]
        public async Task<IActionResult> CountStockInsAsync([FromBody] StockOutSearchDto stockOutSearch)
        {
            var stockOuts = await _service.GetAllAsync(e =>
                                                       e.Number.Contains(stockOutSearch.search) ||
                                                       e.DONumber.Contains(stockOutSearch.search));

            var stockOutDtos = _autoMapperService.Map<List<StockOutDetailsDto>>(stockOuts);
            return Ok(stockOutDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var stockOut = await _service.GetByIdAsync(id); 
            
            if (stockOut == null)
                return NotFound();


            stockOut.StockOutItems = _context.StockOutItems.Where(x => x.StockOutId == stockOut.Id).ToList();

            var stockOutDtos = _autoMapperService.Map<StockOutDetailsDto>(stockOut); 

            return Ok(stockOutDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockOutCreateUpdateDto stockOutCreateUpdateDto)
        { 
            string stockOutNumber = await _runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKOUT);

            stockOutCreateUpdateDto.Number = stockOutNumber;
            var stockOutDtos = _autoMapperService.Map<StockOut>(stockOutCreateUpdateDto);

            await _service.AddAsync(stockOutDtos!, false);

            await _inventoryService.StockOutAsync(stockOutDtos!);

            // 5) fulfill any linked reservation items
            if (stockOutCreateUpdateDto.StockOutItems != null)
            {
                // find all non‐null reservationItemId values
                var reservationItemIds = stockOutCreateUpdateDto.StockOutItems
                    .Where(i => i.ReservationItemId.HasValue)
                    .Select(i => i.ReservationItemId!.Value)
                    .Distinct();

                foreach (var itemId in reservationItemIds)
                {
                    // this method should:
                    //  • reduce ReservedQuantity on the warehouse balance
                    //  • mark the StockReservationItem as fulfilled
                    //  • if all items in a reservation are fulfilled, set the parent StockReservation.Status = FULFILLED
                    await _stockReservationService.FulfillAsync(itemId);
                }
            }

            return CreatedAtAction(nameof(GetById), new { id = stockOutDtos?.Id }, stockOutDtos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] StockOutCreateUpdateDto stockOutCreateUpdate)
        {
            var stockOut = await _service.GetByIdAsync(id);

            var stockOutDtos = _autoMapperService.Map<StockOutDetailsDto>(stockOut);
            if (stockOutDtos == null)
                return NotFound();

            _autoMapperService.Map(stockOutCreateUpdate, stockOut);


            await _service.UpdateAsync(stockOut);
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
