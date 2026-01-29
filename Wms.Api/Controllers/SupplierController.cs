using AutoMapper;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;
using Wms.Api.Dto.Supplier.SupplierCreateUpdate;
using Wms.Api.Dto.Supplier.SupplierDetails;
using Wms.Api.Dto.Supplier.SupplierSearch;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class SupplierController(
        IService<Supplier> service,
        IMapper autoMapperService,
        ApplicationDbContext context,
        IRunningNumberService runningNumberService)
        : ControllerBase
    {
        [HttpGet("select-options")]
        [ProducesResponseType(typeof(PagedListDto<SelectOptionV12Dto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSelectOptionsAsync([FromQuery] GlobalSelectFilterV12Dto selectFilterV12Dto)
        {
            // Build the filter expression
            var predicate = PredicateBuilder.New<Supplier>(true);

            if (selectFilterV12Dto.Ids != null)
            {
                var supplierIds = selectFilterV12Dto.Ids
                    .Where(id => Guid.TryParse(id, out _))
                    .Select(id => Guid.Parse(id))
                    .ToArray();

                if (supplierIds.Length > 0)
                {
                    predicate = predicate.And(supplier => supplierIds.Contains(supplier.Id));
                }
            }

            if (selectFilterV12Dto.SearchString != null)
            {
                predicate = predicate.And(supplier =>
                    supplier.Name.Contains(selectFilterV12Dto.SearchString) ||
                    supplier.SupplierCode.Contains(selectFilterV12Dto.SearchString));
            }

            // Use the reusable pagination method
            var paginatedResult = await service.GetPaginatedAsync(predicate, new Paginator
            {
                Page = selectFilterV12Dto.Page,
                PageSize = selectFilterV12Dto.PageSize,
            });

            var resultToList = await paginatedResult.ToListAsync();

            PagedList<Supplier> pagedResult = new PagedList<Supplier>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var supplierDtos = autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(supplierDtos);
        }

        [HttpPost("search", Name = "SearchSuppliersAsync")]
        public async Task<IActionResult> SearchSuppliersAsync([FromBody] SupplierSearchDto supplierSearch)
        {
            var suppliers = await service.GetAllAsync(e => e.Name.Contains(supplierSearch.search) || e.SupplierCode.Contains(supplierSearch.search));

            var result = suppliers.Skip((supplierSearch.Page - 1) * supplierSearch.PageSize).Take(supplierSearch.PageSize).ToList();

            PagedList<Supplier> pagedResult = new PagedList<Supplier>(result, supplierSearch.Page, supplierSearch.PageSize);

            var supplierDtos = autoMapperService.Map<PagedListDto<SupplierDetailsDto>>(pagedResult);

            return Ok(supplierDtos);
        }

        [HttpPost("count", Name = "CountSuppliersAsync")]
        public async Task<IActionResult> CountSuppliersAsync([FromBody] SupplierSearchDto supplierSearch)
        {
            var suppliers = await service.GetAllAsync(e => e.Name.Contains(supplierSearch.search) || e.SupplierCode.Contains(supplierSearch.search));

            var supplierDtos = autoMapperService.Map<List<SupplierDetailsDto>>(suppliers);
            return Ok(supplierDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var supplier = await service.GetByIdAsync(id);

            if (supplier == null)
                return NotFound();

            var supplierDetails = autoMapperService.Map<SupplierDetailsDto>(supplier);

            return Ok(supplierDetails);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SupplierCreateUpdateDto supplierCreateUpdateDto)
        {
            var supplier = autoMapperService.Map<Supplier>(supplierCreateUpdateDto);

            // Autogenerate supplier code
            supplier.SupplierCode = await runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.SUPPLIER);

            await service.AddAsync(supplier);
            return CreatedAtAction(nameof(GetById), new { id = supplier.Id }, supplier);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] SupplierCreateUpdateDto supplierCreateUpdateDto)
        {
            var supplier = await service.GetByIdAsync(id);
            if (supplier == null)
                return NotFound();

            // Preserve existing code when updating
            var existingCode = supplier.SupplierCode;
            autoMapperService.Map(supplierCreateUpdateDto, supplier);
            supplier.SupplierCode = existingCode;

            await service.UpdateAsync(supplier);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await service.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet(Name = "FindSupplierAsync")]
        public async Task<IActionResult> FindSupplierAsync([FromQuery] SupplierFindByParametersDto supplierFindByParametersDto)
        {
            var supplierIdsAsString = supplierFindByParametersDto.SupplierIds.Select(id => id.ToString()).ToArray();

            var suppliersQuery = await service.GetAllAsync(e => supplierIdsAsString.Contains(e.Id.ToString()));

            var result = suppliersQuery
                .Skip((supplierFindByParametersDto.Page - 1) * supplierFindByParametersDto.PageSize)
                .Take(supplierFindByParametersDto.PageSize)
                .ToList();

            PagedList<Supplier> pagedResult = new PagedList<Supplier>(
                result,
                supplierFindByParametersDto.Page,
                supplierFindByParametersDto.PageSize);

            var supplierDtos = autoMapperService.Map<PagedListDto<SupplierDetailsDto>>(pagedResult);

            return Ok(supplierDtos);
        }
    }
}
