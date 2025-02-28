using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList; 
using Wms.Api.Entities;
using Wms.Api.Services;
using Wms.Api.Dto.Colour;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ColourController : ControllerBase
    {
        private readonly IService<Colour> _service;
        private readonly IMapper _autoMapperService;

        public ColourController(IService<Colour> service, IMapper autoMapperService)
        {
            _service = service;
            _autoMapperService = autoMapperService;
        }


        [HttpGet("select-options")]
        [ProducesResponseType(typeof(PagedListDto<SelectOptionV12Dto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSelectOptionsAsync([FromQuery] GlobalSelectFilterV12Dto selectFilterV12Dto)
        {
            var predicate = PredicateBuilder.New<Colour>(true);

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

            PagedList<Colour> pagedResult = new PagedList<Colour>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var colourDtos = _autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(colourDtos);
        }

        [HttpPost("search", Name = "SearchColoursAsync")]
        public async Task<IActionResult> SearchColoursAsync([FromBody] ColourSearchDto colourSearch)
        {
            var colours = await _service.GetAllAsync(e => e.Name.Contains(colourSearch.Search));

            var result = colours.Skip((colourSearch.Page - 1) * colourSearch.PageSize).Take(colourSearch.PageSize).ToList();
            PagedList<Colour> pagedResult = new PagedList<Colour>(result, colourSearch.Page, colourSearch.PageSize);

            var colourDtos = _autoMapperService.Map<PagedListDto<ColourDetailsDto>>(pagedResult);
            return Ok(colourDtos);
        }

        [HttpPost("count", Name = "CountColoursAsync")]
        public async Task<IActionResult> CountColoursAsync([FromBody] ColourSearchDto colourSearch)
        {
            var colours = await _service.GetAllAsync(e => e.Name.Contains(colourSearch.Search));

            var colourDtos = _autoMapperService.Map<List<ColourDetailsDto>>(colours);
            return Ok(colourDtos.Count);
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
        public async Task<IActionResult> Create([FromBody] Colour product)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _service.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Colour product)
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
