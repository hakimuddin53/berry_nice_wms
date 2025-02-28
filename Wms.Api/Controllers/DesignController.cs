using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList; 
using Wms.Api.Entities;
using Wms.Api.Services;
using Wms.Api.Dto.Design;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class DesignController : ControllerBase
    {
        private readonly IService<Design> _service;
        private readonly IMapper _autoMapperService;

        public DesignController(IService<Design> service, IMapper autoMapperService)
        {
            _service = service;
            _autoMapperService = autoMapperService;
        }


        [HttpGet("select-options")]
        [ProducesResponseType(typeof(PagedListDto<SelectOptionV12Dto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSelectOptionsAsync([FromQuery] GlobalSelectFilterV12Dto selectFilterV12Dto)
        {
            var predicate = PredicateBuilder.New<Design>(true);

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

            PagedList<Design> pagedResult = new PagedList<Design>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var designDtos = _autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(designDtos);
        }

        [HttpPost("search", Name = "SearchDesignsAsync")]
        public async Task<IActionResult> SearchDesignsAsync([FromBody] DesignSearchDto designSearch)
        {
            var designs = await _service.GetAllAsync(e => e.Name.Contains(designSearch.Search));

            var result = designs.Skip((designSearch.Page - 1) * designSearch.PageSize).Take(designSearch.PageSize).ToList();
            PagedList<Design> pagedResult = new PagedList<Design>(result, designSearch.Page, designSearch.PageSize);

            var designDtos = _autoMapperService.Map<PagedListDto<DesignDetailsDto>>(pagedResult);
            return Ok(designDtos);
        }

        [HttpPost("count", Name = "CountDesignsAsync")]
        public async Task<IActionResult> CountDesignsAsync([FromBody] DesignSearchDto designSearch)
        {
            var designs = await _service.GetAllAsync(e => e.Name.Contains(designSearch.Search));

            var designDtos = _autoMapperService.Map<List<DesignDetailsDto>>(designs);
            return Ok(designDtos.Count);
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
        public async Task<IActionResult> Create([FromBody] Design product)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _service.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Design product)
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
