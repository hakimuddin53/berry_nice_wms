using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList; 
using Wms.Api.Dto.StockReservation.StockReservationCreateUpdate;
using Wms.Api.Dto.StockReservation.StockReservationDetails;
using Wms.Api.Dto.StockReservation.StockReservationSearch;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/stock-reservation")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class StockReservationController(IService<StockReservation> service, IStockReservationService stockReservationService,
        IMapper autoMapperService, ApplicationDbContext applicationDbContext, IRunningNumberService runningNumberService) : ControllerBase
    {
        private readonly IService<StockReservation> _service = service;
        private readonly IStockReservationService _stockReservationService = stockReservationService;
        private readonly IRunningNumberService _runningNumberService = runningNumberService;
        private readonly IMapper _autoMapperService = autoMapperService;
        private readonly ApplicationDbContext _context = applicationDbContext;

        [HttpPost("search", Name = "SearchStockReservationsAsync")]
        public async Task<IActionResult> SearchStockReservationsAsync([FromBody] StockReservationSearchDto stockReservationSearch)
        {  
            var stockReservations = await _service.GetAllAsync(e => e.Number.Contains(stockReservationSearch.search));

            var orderedstockReservations = stockReservations.OrderByDescending(e => e.CreatedAt);

            var result = orderedstockReservations.Skip((stockReservationSearch.Page - 1) * stockReservationSearch.PageSize).Take(stockReservationSearch.PageSize).ToList();
            PagedList<StockReservation> pagedResult = new PagedList<StockReservation>(result, stockReservationSearch.Page, stockReservationSearch.PageSize);

            var stockReservationDtos = _autoMapperService.Map<PagedListDto<StockReservationDetailsDto>>(pagedResult); 
            return Ok(stockReservationDtos);
        }
         
        [HttpPost("count", Name = "CountStockReservationsAsync")]     
        public async Task<IActionResult> CountStockReservationsAsync([FromBody] StockReservationSearchDto stockReservationSearch)
        {
            var stockReservations = await _service.GetAllAsync(e => e.Number.Contains(stockReservationSearch.search));
             
            var stockReservationDtos = _autoMapperService.Map<List<StockReservationDetailsDto>>(stockReservations);
            return Ok(stockReservationDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var stockReservation = await _service.GetByIdAsync(id);
            if (stockReservation == null)
                return NotFound();

            stockReservation.StockReservationItems = _context.StockReservationItems.Where(x => x.StockReservationId == stockReservation.Id).ToList();

            var stockReservationDtos = _autoMapperService.Map<StockReservationDetailsDto>(stockReservation);
            return Ok(stockReservationDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockReservationCreateUpdateDto stockReservationCreateUpdateDto)
        {
            string stockReservationNumber = await _runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKRESERVATION);

            stockReservationCreateUpdateDto.Number = stockReservationNumber;
            var stockReservationDtos = _autoMapperService.Map<StockReservation>(stockReservationCreateUpdateDto);

            // Ensure StockReservationItems is initialized to avoid null reference
            stockReservationDtos.StockReservationItems ??= new List<StockReservationItem>();

            foreach (var item in stockReservationDtos.StockReservationItems)
            {
                await _stockReservationService.ReserveAsync(item.ProductId, stockReservationDtos.WarehouseId, item.Quantity);
            }

            await _service.AddAsync(stockReservationDtos!);
          
            return CreatedAtAction(nameof(GetById), new { id = stockReservationDtos?.Id }, stockReservationDtos);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActive([FromQuery] Guid productId, [FromQuery] Guid warehouseId)
        {
            return Ok(await _stockReservationService.GetActiveReservationAsync(productId, warehouseId));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] StockReservationCreateUpdateDto stockReservationCreateUpdate)
        {
            var stockReservation = await _service.GetByIdAsync(id);

            var stockReservationDtos = _autoMapperService.Map<StockReservationDetailsDto>(stockReservation);
            if (stockReservationDtos == null)
                return NotFound();

            _autoMapperService.Map(stockReservationCreateUpdate, stockReservation);

            await _service.UpdateAsync(stockReservation);
            return NoContent();
        }

        [HttpPost("{id}/request-cancel")]
        public async Task<IActionResult> RequestCancel(Guid id)
        {
            var user = User.Identity!.Name!;  
            await _stockReservationService.RequestCancellationAsync(id, user, "");
            return NoContent();
        }

        [HttpPost("{id}/approve-cancel")] 
        public async Task<IActionResult> ApproveCancel(Guid id)
        {
            var user = User.Identity!.Name!;
            await _stockReservationService.ApproveCancellationAsync(id, user);
            return NoContent();
        }

    }
}
