using AutoMapper;
using DocumentFormat.OpenXml.InkML;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.Location;
using Wms.Api.Dto.PagedList; 
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class LocationController(IService<Location> service, IMapper autoMapperService, ApplicationDbContext _context) : ControllerBase
    {
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
            var paginatedResult = await service.GetPaginatedAsync(predicate, new Paginator
            {
                Page = selectFilterV12Dto.Page,
                PageSize = selectFilterV12Dto.PageSize,
            });

            var resultToList = await paginatedResult.ToListAsync();

            PagedList<Location> pagedResult = new PagedList<Location>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var locationDtos = autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(locationDtos);
        }

        [HttpPost("search", Name = "SearchLocationsAsync")]
        public async Task<IActionResult> SearchLocationsAsync([FromBody] LocationSearchDto locationSearch)
        {
            var locations = await service.GetAllAsync(e => e.Name.Contains(locationSearch.Search));

            var result = locations.Skip((locationSearch.Page - 1) * locationSearch.PageSize).Take(locationSearch.PageSize).ToList();
            PagedList<Location> pagedResult = new PagedList<Location>(result, locationSearch.Page, locationSearch.PageSize);

            var locationDtos = autoMapperService.Map<PagedListDto<LocationDetailsDto>>(pagedResult);
            return Ok(locationDtos);
        }

        [HttpPost("count", Name = "CountLocationsAsync")]
        public async Task<IActionResult> CountLocationsAsync([FromBody] LocationSearchDto locationSearch)
        {
            var locations = await service.GetAllAsync(e => e.Name.Contains(locationSearch.Search));

            var locationDtos = autoMapperService.Map<List<LocationDetailsDto>>(locations);
            return Ok(locationDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await service.GetByIdAsync(id);
            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Location product)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await service.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Location product)
        {
            if (!ModelState.IsValid || id != product.Id)
                return BadRequest();

            await service.UpdateAsync(product);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await service.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet(Name = "FindLocationAsync")]
        public async Task<IActionResult> FindLocationAsync([FromQuery] LocationFindByParametersDto locationFindByParametersDto)
        {
            var locationIdsAsString = locationFindByParametersDto.LocationIds.Select(id => id.ToString()).ToArray();

            var locationsQuery = await service.GetAllAsync(e => locationIdsAsString.Contains(e.Id.ToString()));

            var result = locationsQuery
                .Skip((locationFindByParametersDto.Page - 1) * locationFindByParametersDto.PageSize)
                .Take(locationFindByParametersDto.PageSize)
                .ToList();

            PagedList<Location> pagedResult = new PagedList<Location>(
                result,
                locationFindByParametersDto.Page,
                locationFindByParametersDto.PageSize);

            var locationDtos = autoMapperService.Map<PagedListDto<LocationDetailsDto>>(pagedResult);

            return Ok(locationDtos);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActive([FromQuery] Guid productId, [FromQuery] Guid warehouseId)
        { // 0) Validate inputs
            if (productId == Guid.Empty)
                return BadRequest("productId must be provided and non-empty.");
            if (warehouseId == Guid.Empty)
                return BadRequest("warehouseId must be provided and non-empty.");

            // 1) Try to get only racks with available stock
            var activeBalances = await _context.InventoryBalances
                .Where(ib => ib.ProductId == productId
                          && ib.WarehouseId == warehouseId
                          && ib.Quantity > 0)
                .Join(_context.Locations,
                      ib => ib.CurrentLocationId,
                      loc => loc.Id,
                      (ib, loc) => new ActiveLocationDto
                      {
                          LocationId = ib.CurrentLocationId,
                          Name = loc.Name,
                          Quantity = ib.Quantity
                      })
                .OrderByDescending(x => x.Quantity)  // smart: partially-filled first
                .ToListAsync();

            // 2) If none found, fall back to listing _all_ racks in this warehouse/product
            if (!activeBalances.Any())
            {
                activeBalances = await _context.Locations
                // If you eventually add a WarehouseId on Location, uncomment the next line:
                // .Where(loc => loc.WarehouseId == warehouseId)
                    .OrderBy(loc => loc.Name)
                    .Select(loc => new ActiveLocationDto
                    {
                        LocationId = loc.Id,
                        Name = loc.Name,
                        Quantity = 0
                    })
                    .ToListAsync();
            }

            return Ok(activeBalances);
        }
    }
}
