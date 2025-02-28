using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList; 
using Wms.Api.Entities;
using Wms.Api.Services;
using Wms.Api.Dto.Category; 
using LinqKit;
using System.Linq;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class CategoryController : ControllerBase
    {
        private readonly IService<Category> _service;
        private readonly IMapper _autoMapperService;

        public CategoryController(IService<Category> service, IMapper autoMapperService)
        {
            _service = service;
            _autoMapperService = autoMapperService;
        }


        [HttpGet("select-options")]
        [ProducesResponseType(typeof(PagedListDto<SelectOptionV12Dto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSelectOptionsAsync([FromQuery] GlobalSelectFilterV12Dto selectFilterV12Dto)
        { 
            var predicate = PredicateBuilder.New<Category>(true);

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

            PagedList<Category> pagedResult = new PagedList<Category>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var categoryDtos = _autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(categoryDtos);
        }

        [HttpPost("search", Name = "SearchCategorysAsync")]
        public async Task<IActionResult> SearchCategorysAsync([FromBody] CategorySearchDto categorySearch)
        {
            var categorys = await _service.GetAllAsync(e => e.Name.Contains(categorySearch.Search));

            var result = categorys.Skip((categorySearch.Page - 1) * categorySearch.PageSize).Take(categorySearch.PageSize).ToList();
            PagedList<Category> pagedResult = new PagedList<Category>(result, categorySearch.Page, categorySearch.PageSize);

            var categoryDtos = _autoMapperService.Map<PagedListDto<CategoryDetailsDto>>(pagedResult);
            return Ok(categoryDtos);
        }

        [HttpPost("count", Name = "CountCategorysAsync")]
        public async Task<IActionResult> CountCategorysAsync([FromBody] CategorySearchDto categorySearch)
        {
            var categorys = await _service.GetAllAsync(e => e.Name.Contains(categorySearch.Search));

            var categoryDtos = _autoMapperService.Map<List<CategoryDetailsDto>>(categorys);
            return Ok(categoryDtos.Count);
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
        public async Task<IActionResult> Create([FromBody] Category product)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _service.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Category product)
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
