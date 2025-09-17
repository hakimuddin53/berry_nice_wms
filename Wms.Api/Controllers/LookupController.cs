using AutoMapper;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Dto;
using Wms.Api.Dto.Lookup;
using Wms.Api.Dto.PagedList; 
using Wms.Api.Model;
using Wms.Api.Services;
using Lookup = Wms.Api.Entities.Lookup;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class LookupController : ControllerBase
    {
        private readonly IService<Lookup> _service;
        private readonly IMapper _mapper;

        public LookupController(IService<Lookup> service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }
 
        [HttpGet("select-options/{groupKey}")]
        [ProducesResponseType(typeof(PagedListDto<SelectOptionV12Dto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSelectOptionsAsync(
            [FromRoute] LookupGroupKey groupKey,
            [FromQuery] GlobalSelectFilterV12Dto filter)
        {
            var predicate = PredicateBuilder.New<Lookup>(l => l.GroupKey == groupKey && l.IsActive);

            if (filter.Ids != null && filter.Ids.Any())
            {
                var lookupIds = filter.Ids
                    .Where(id => Guid.TryParse(id, out _))
                    .Select(id => Guid.Parse(id))
                    .ToArray();

                if (lookupIds.Length > 0)
                {
                    predicate = predicate.And(l => lookupIds.Contains(l.Id));
                }
            }

            if (!string.IsNullOrWhiteSpace(filter.SearchString))
            {
                var s = filter.SearchString!;
                predicate = predicate.And(l => l.Code.Contains(s) || l.Label.Contains(s));
            }

            var pagedQuery = await _service.GetPaginatedAsync(
                predicate,
                new Paginator { Page = filter.Page, PageSize = filter.PageSize });

            var items = await pagedQuery.ToListAsync();
            var paged = new PagedList<Lookup>(items, filter.Page, filter.PageSize);

            var dto = _mapper.Map<PagedListDto<SelectOptionV12Dto>>(paged);
            return Ok(dto);
        }

     
        [HttpPost("search")]
        [ProducesResponseType(typeof(PagedListDto<LookupDetailsDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> SearchAsync([FromBody] LookupSearchDto search)
        {
            if (!Enum.TryParse<LookupGroupKey>(search.GroupKey, true, out var groupKey))
            {
                var valid = string.Join(", ", Enum.GetNames(typeof(LookupGroupKey)));
                return BadRequest($"Unknown lookup group '{search.GroupKey}'. Valid: {valid}");
            }

            var predicate = PredicateBuilder.New<Lookup>(l => l.GroupKey == groupKey);

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var s = search.Search!;
                predicate = predicate.And(l => l.Code.Contains(s) || l.Label.Contains(s));
            }

            if (search.ActiveOnly) predicate = predicate.And(l => l.IsActive);

            var all = await _service.GetAllAsync(predicate);

            var pageItems = all.Skip((search.Page - 1) * search.PageSize).Take(search.PageSize).ToList();
            var paged = new PagedList<Lookup>(pageItems, search.Page, search.PageSize);
             

            var dto = _mapper.Map<PagedListDto<LookupDetailsDto>>(paged);
            return Ok(dto);
        }

        [HttpPost("count")]
        public async Task<IActionResult> CountAsync([FromBody] LookupSearchDto search)
        {
            if (!Enum.TryParse<LookupGroupKey>(search.GroupKey, true, out var key))
                return BadRequest($"Unknown lookup group '{search.GroupKey}'. " +
                                  $"Valid: {string.Join(", ", Enum.GetNames(typeof(LookupGroupKey)))}");

            var predicate = PredicateBuilder.New<Lookup>(l => l.GroupKey == key);

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var s = search.Search!;
                predicate = predicate.And(l => l.Code.Contains(s) || l.Label.Contains(s));
            }

            if (search.ActiveOnly) predicate = predicate.And(l => l.IsActive);

            var items = await _service.GetAllAsync(predicate);
            return Ok(items.Count());
        }

        // Optional: quickly list existing groups with counts
        //[HttpGet("groups")]
        //public async Task<IActionResult> GetGroupsAsync()
        //{
        //    // Use underlying queryable for grouping
        //    var query = _service.Query();
        //    var groups = await query
        //        .GroupBy(l => l.GroupKey)
        //        .Select(g => new { GroupKey = g.Key, Count = g.Count() })
        //        .OrderBy(x => x.GroupKey)
        //        .ToListAsync();

        //    return Ok(groups);
        //}

 
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(LookupDetailsDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null) return NotFound();
            return Ok(_mapper.Map<LookupDetailsDto>(entity));
        }

        [HttpPost]
        [ProducesResponseType(typeof(LookupDetailsDto), StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromBody] LookupCreateUpdateDto dto)
        {
            // Enforce unique (GroupKey, Code)
            var exists = (await _service.GetAllAsync(l => l.GroupKey == dto.GroupKey && l.Code == dto.Code)).Any();
            if (exists) 
                return Conflict($"Code '{dto.Code}' already exists for group '{dto.GroupKey}'.");

            var entity = _mapper.Map<Lookup>(dto);
            await _service.AddAsync(entity);
            var outDto = _mapper.Map<LookupDetailsDto>(entity);
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, outDto);
        }

        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(LookupDetailsDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> Update(Guid id, [FromBody] LookupCreateUpdateDto dto)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null) return NotFound();

            // If GroupKey or Code changed, re-check uniqueness
            var willChangeKey = entity.GroupKey != dto.GroupKey || !string.Equals(entity.Code, dto.Code, StringComparison.Ordinal);
            if (willChangeKey)
            {
                var dup = (await _service.GetAllAsync(l => l.Id != id && l.GroupKey == dto.GroupKey && l.Code == dto.Code)).Any();
                if (dup) 
                    return Conflict($"Code '{dto.Code}' already exists for group '{dto.GroupKey}'.");
            }

            _mapper.Map(dto, entity);
            await _service.UpdateAsync(entity);

            return Ok(_mapper.Map<LookupDetailsDto>(entity));
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            // Soft delete preferred: flip IsActive=false
            var entity = await _service.GetByIdAsync(id);
            if (entity == null) return NotFound();

            entity.IsActive = false;
            await _service.UpdateAsync(entity);
            return NoContent();
        }
    }
}
