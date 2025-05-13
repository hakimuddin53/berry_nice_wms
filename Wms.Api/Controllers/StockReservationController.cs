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
    public class StockReservationController : ControllerBase
    {
        private readonly IService<StockReservation> _service;
        private readonly IRunningNumberService _runningNumberService;
        private readonly IMapper _autoMapperService;
        private readonly ApplicationDbContext _context;

        public StockReservationController(IService<StockReservation> service,
            IMapper autoMapperService, ApplicationDbContext applicationDbContext, IRunningNumberService runningNumberService)
        {
            _service = service;
            _autoMapperService = autoMapperService;
            _runningNumberService = runningNumberService;
            _context = applicationDbContext;
        }

        [HttpPost("search", Name = "SearchStockReservationsAsync")]
        public async Task<IActionResult> SearchStockReservationsAsync([FromBody] StockReservationSearchDto stockInSearch)
        {  
            var stockIns = await _service.GetAllAsync(e => e.Number.Contains(stockInSearch.search));

            var result = stockIns.Skip((stockInSearch.Page - 1) * stockInSearch.PageSize).Take(stockInSearch.PageSize).ToList();
            PagedList<StockReservation> pagedResult = new PagedList<StockReservation>(result, stockInSearch.Page, stockInSearch.PageSize);

            var stockInDtos = _autoMapperService.Map<PagedListDto<StockReservationDetailsDto>>(pagedResult); 
            return Ok(stockInDtos);
        }
         
        [HttpPost("count", Name = "CountStockReservationsAsync")]     
        public async Task<IActionResult> CountStockReservationsAsync([FromBody] StockReservationSearchDto stockInSearch)
        {
            var stockIns = await _service.GetAllAsync(e => e.Number.Contains(stockInSearch.search));
             
            var stockInDtos = _autoMapperService.Map<List<StockReservationDetailsDto>>(stockIns);
            return Ok(stockInDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var stockIn = await _service.GetByIdAsync(id);
            if (stockIn == null)
                return NotFound();

            stockIn.StockReservationItems = _context.StockReservationItems.Where(x => x.StockReservationId == stockIn.Id).ToList();

            var stockInDtos = _autoMapperService.Map<StockReservationDetailsDto>(stockIn);
            return Ok(stockInDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockReservationCreateUpdateDto stockReservationCreateUpdateDto)
        {
            string stockReservationNumber = await _runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKRESERVATION);

            stockReservationCreateUpdateDto.Number = stockReservationNumber;
            var stockReservationDtos = _autoMapperService.Map<StockReservation>(stockReservationCreateUpdateDto);
            

            await _service.AddAsync(stockReservationDtos!);
            return CreatedAtAction(nameof(GetById), new { id = stockReservationDtos?.Id }, stockReservationDtos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] StockReservationCreateUpdateDto stockInCreateUpdate)
        {
            var stockIn = await _service.GetByIdAsync(id);

            var stockInDtos = _autoMapperService.Map<StockReservationDetailsDto>(stockIn);
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
