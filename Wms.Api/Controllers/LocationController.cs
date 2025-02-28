using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList; 
using Wms.Api.Entities;
using Wms.Api.Services;
using Wms.Api.Dto.Location;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class LocationController : ControllerBase
    {
        private readonly IService<Location> _service;
        private readonly IMapper _autoMapperService;

        public LocationController(IService<Location> service, IMapper autoMapperService)
        {
            _service = service;
            _autoMapperService = autoMapperService;
        }


        [HttpGet("select-options")]
        [ProducesResponseType(typeof(PagedListDto<SelectOptionV12Dto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSelectOptionsAsync([FromQuery] GlobalSelectFilterV12Dto selectFilterV12Dto)
        {
            var predicate = PredicateBuilder.New<Location>(true);

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

            PagedList<Location> pagedResult = new PagedList<Location>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var locationDtos = _autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(locationDtos);
        }

        [HttpPost("search", Name = "SearchLocationsAsync")]
        public async Task<IActionResult> SearchLocationsAsync([FromBody] LocationSearchDto locationSearch)
        {
            var locations = await _service.GetAllAsync(e => e.Name.Contains(locationSearch.Search));

            var result = locations.Skip((locationSearch.Page - 1) * locationSearch.PageSize).Take(locationSearch.PageSize).ToList();
            PagedList<Location> pagedResult = new PagedList<Location>(result, locationSearch.Page, locationSearch.PageSize);

            var locationDtos = _autoMapperService.Map<PagedListDto<LocationDetailsDto>>(pagedResult);
            return Ok(locationDtos);
        }

        [HttpPost("count", Name = "CountLocationsAsync")]
        public async Task<IActionResult> CountLocationsAsync([FromBody] LocationSearchDto locationSearch)
        {
            var locations = await _service.GetAllAsync(e => e.Name.Contains(locationSearch.Search));

            var locationDtos = _autoMapperService.Map<List<LocationDetailsDto>>(locations);
            return Ok(locationDtos.Count);
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
        public async Task<IActionResult> Create([FromBody] Location product)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _service.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Location product)
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
