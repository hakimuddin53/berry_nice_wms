using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Wms.Api.Dto.StockOut.StockOutCreateUpdate;
using Wms.Api.Dto.StockOut.StockOutCreateUpdateDto;
using Wms.Api.Dto.StockOut.StockOutSearch;
using Wms.Api.Entities;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/stock-out")]
    public class StockOutController : ControllerBase
    {
        private readonly IService<StockOut> _service; 
        private readonly IMapper _autoMapperService;

        public StockOutController(IService<StockOut> service,
            IMapper autoMapperService)
        {
            _service = service;
            _autoMapperService = autoMapperService;
        }

        [HttpPost("search", Name = "SearchStockOutsAsync")]
        public async Task<IActionResult> SearchStockOutsAsync([FromBody] StockOutSearchDto stockOutSearch)
        {  
            var stockOuts = await _service.GetAllAsync(e => e.Number.Contains(stockOutSearch.search));
            var stockOutDtos = _autoMapperService.Map<List<StockOutDetailsDto>>(stockOuts);
            return Ok(stockOutDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var stockOut = await _service.GetByIdAsync(id);

            var stockOutDtos = _autoMapperService.Map<StockOutDetailsDto>(stockOut);
            if (stockOutDtos == null)
                return NotFound();

            return Ok(stockOutDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockOutCreateUpdateDto stockOutCreateUpdateDto)
        { 
            var stockOutDtos = _autoMapperService.Map<StockOut>(stockOutCreateUpdateDto);
            await _service.AddAsync(stockOutDtos);
            return CreatedAtAction(nameof(GetById), new { id = stockOutDtos.Id }, stockOutDtos);
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
