using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;
using Wms.Api.Services;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using ClientCode = Wms.Api.Entities.ClientCode;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/client-code")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ClientCodeController(IService<ClientCode> service, IMapper autoMapperService) : ControllerBase
    {
        [HttpGet("select-options")]
        [ProducesResponseType(typeof(PagedListDto<SelectOptionV12Dto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSelectOptionsAsync([FromQuery] GlobalSelectFilterV12Dto selectFilterV12Dto)
        {
            var predicate = PredicateBuilder.New<ClientCode>(true);

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

            PagedList<ClientCode> pagedResult = new PagedList<ClientCode>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var clientCodeDtos = autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(clientCodeDtos);
        }

        [HttpPost("search", Name = "SearchClientCodesAsync")]
        public async Task<IActionResult> SearchClientCodesAsync([FromBody] Dto.ClientCode.ClientCode.ClientCodeSearchDto clientCodeSearch)
        {
            var clientCodes = await service.GetAllAsync(e => e.Name.Contains(clientCodeSearch.Search));

            var result = clientCodes.Skip((clientCodeSearch.Page - 1) * clientCodeSearch.PageSize).Take(clientCodeSearch.PageSize).ToList();
            PagedList<ClientCode> pagedResult = new PagedList<ClientCode>(result, clientCodeSearch.Page, clientCodeSearch.PageSize);

            var clientCodeDtos = autoMapperService.Map<PagedListDto<Dto.ClientCode.ClientCode.ClientCodeDetailsDto>>(pagedResult);
            return Ok(clientCodeDtos);
        }

        [HttpPost("count", Name = "CountClientCodesAsync")]
        public async Task<IActionResult> CountClientCodesAsync([FromBody] Dto.ClientCode.ClientCode.ClientCodeSearchDto clientCodeSearch)
        {
            var clientCodes = await service.GetAllAsync(e => e.Name.Contains(clientCodeSearch.Search));

            var clientCodeDtos = autoMapperService.Map<List<Dto.ClientCode.ClientCode.ClientCodeDetailsDto>>(clientCodes);
            return Ok(clientCodeDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await service.GetByIdAsync(id);

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ClientCode product)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await service.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ClientCode product)
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
    }
}
