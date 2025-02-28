using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList; 
using Wms.Api.Entities;
using Wms.Api.Services;
using Wms.Api.Dto.CartonSize;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class CartonSizeController : ControllerBase
    {
        private readonly IService<CartonSize> _service;
        private readonly IMapper _autoMapperService;

        public CartonSizeController(IService<CartonSize> service, IMapper autoMapperService)
        {
            _service = service;
            _autoMapperService = autoMapperService;
        }

        [HttpGet("select-options")]
        [ProducesResponseType(typeof(PagedListDto<SelectOptionV12Dto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSelectOptionsAsync([FromQuery] GlobalSelectFilterV12Dto selectFilterV12Dto)
        {
            var predicate = PredicateBuilder.New<CartonSize>(true);

            if (selectFilterV12Dto.Ids != null)
            {
                predicate = predicate.And(product => selectFilterV12Dto.Ids.Contains(product.Id));
            }

            if (selectFilterV12Dto.SearchString != null)
            {
                predicate = predicate.And(product =>
                    product.Name.Contains(selectFilterV12Dto.SearchString));
            }

            // Use the reusable pagination method
            var paginatedResult = await _service.GetPaginatedAsync(predicate, new Paginator
            {
                Page = selectFilterV12Dto.Page,
                PageSize = selectFilterV12Dto.PageSize,
            });

            var resultToList = await paginatedResult.ToListAsync();

            PagedList<CartonSize> pagedResult = new PagedList<CartonSize>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var cartonSizeDtos = _autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(cartonSizeDtos);
        }

        [HttpPost("search", Name = "SearchCartonSizesAsync")]
        public async Task<IActionResult> SearchCartonSizesAsync([FromBody] CartonSizeSearchDto cartonSizeSearch)
        {
            var cartonSizes = await _service.GetAllAsync(e => e.Name.Contains(cartonSizeSearch.Search));

            var result = cartonSizes.Skip((cartonSizeSearch.Page - 1) * cartonSizeSearch.PageSize).Take(cartonSizeSearch.PageSize).ToList();
            PagedList<CartonSize> pagedResult = new PagedList<CartonSize>(result, cartonSizeSearch.Page, cartonSizeSearch.PageSize);

            var cartonSizeDtos = _autoMapperService.Map<PagedListDto<CartonSizeDetailsDto>>(pagedResult);
            return Ok(cartonSizeDtos);
        }

        [HttpPost("count", Name = "CountCartonSizesAsync")]
        public async Task<IActionResult> CountCartonSizesAsync([FromBody] CartonSizeSearchDto cartonSizeSearch)
        {
            var cartonSizes = await _service.GetAllAsync(e => e.Name.Contains(cartonSizeSearch.Search));

            var cartonSizeDtos = _autoMapperService.Map<List<CartonSizeDetailsDto>>(cartonSizes);
            return Ok(cartonSizeDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null)
                return NotFound();

            return Ok(product);
        }
        
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CartonSize product)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _service.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CartonSize product)
        {
            if (!ModelState.IsValid || id != product.Id)
                return BadRequest();

            await _service.UpdateAsync(product);
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
