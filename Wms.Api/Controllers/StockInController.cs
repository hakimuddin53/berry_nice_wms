using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Wms.Api.Dto.StockIn.StockInCreateUpdate;
using Wms.Api.Dto.StockIn.StockInSearch;
using Wms.Api.Entities;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/stock-in")]
    public class StockInController : ControllerBase
    {
        private readonly IService<StockIn> _service; 
        private readonly IMapper _autoMapperService;

        public StockInController(IService<StockIn> service,
            IMapper autoMapperService)
        {
            _service = service;
            _autoMapperService = autoMapperService;
        }

        [HttpPost("search", Name = "SearchStockInsAsync")]
        public async Task<IActionResult> SearchStockInsAsync([FromBody] StockInSearchDto stockInSearch)
        {  
            var stockIns = await _service.GetAllAsync(e => e.Number.Contains(stockInSearch.search));
            var stockInDtos = _autoMapperService.Map<List<StockInDetailsDto>>(stockIns);
            return Ok(stockInDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var stockIn = await _service.GetByIdAsync(id);

            var stockInDtos = _autoMapperService.Map<StockInDetailsDto>(stockIn);
            if (stockInDtos == null)
                return NotFound();

            return Ok(stockInDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockInCreateUpdateDto stockInCreateUpdateDto)
        { 
            var stockInDtos = _autoMapperService.Map<StockIn>(stockInCreateUpdateDto);
            await _service.AddAsync(stockInDtos);
            return CreatedAtAction(nameof(GetById), new { id = stockInDtos.Id }, stockInDtos);
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
