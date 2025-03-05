using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList; 
using Wms.Api.Entities;
using Wms.Api.Services;
using Wms.Api.Dto.Warehouse;
using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer; 

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class WarehouseController : ControllerBase
    {
        private readonly IService<Warehouse> _service;
        private readonly IMapper _autoMapperService;

        public WarehouseController(IService<Warehouse> service, IMapper autoMapperService)
        {
            _service = service;
            _autoMapperService = autoMapperService;
        }


        [HttpGet("select-options")]
        [ProducesResponseType(typeof(PagedListDto<SelectOptionV12Dto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSelectOptionsAsync([FromQuery] GlobalSelectFilterV12Dto selectFilterV12Dto)
        {
            var predicate = PredicateBuilder.New<Warehouse>(true);

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

            PagedList<Warehouse> pagedResult = new PagedList<Warehouse>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var warehouseDtos = _autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(warehouseDtos);
        }

        [HttpPost("search", Name = "SearchWarehousesAsync")]
        public async Task<IActionResult> SearchWarehousesAsync([FromBody] WarehouseSearchDto warehouseSearch)
        {
            var warehouses = await _service.GetAllAsync(e => e.Name.Contains(warehouseSearch.Search));

            var result = warehouses.Skip((warehouseSearch.Page - 1) * warehouseSearch.PageSize).Take(warehouseSearch.PageSize).ToList();
            PagedList<Warehouse> pagedResult = new PagedList<Warehouse>(result, warehouseSearch.Page, warehouseSearch.PageSize);

            var warehouseDtos = _autoMapperService.Map<PagedListDto<WarehouseDetailsDto>>(pagedResult);         
             
            return Ok(warehouseDtos);  
        }

        [HttpPost("count", Name = "CountWarehousesAsync")]
        public async Task<IActionResult> CountWarehousesAsync([FromBody] WarehouseSearchDto warehouseSearch)
        {
            var warehouses = await _service.GetAllAsync(e => e.Name.Contains(warehouseSearch.Search));

            var warehouseDtos = _autoMapperService.Map<List<WarehouseDetailsDto>>(warehouses);
            return Ok(warehouseDtos.Count);
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
        public async Task<IActionResult> Create([FromBody] Warehouse product)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _service.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Warehouse product)
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
