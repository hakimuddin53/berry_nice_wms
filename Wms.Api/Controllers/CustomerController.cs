using AutoMapper;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.Customer.CustomerCreateUpdate;
using Wms.Api.Dto.Customer.CustomerDetails;
using Wms.Api.Dto.Customer.CustomerSearch;
using Wms.Api.Dto.PagedList;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class CustomerController(
        IService<Customer> service,
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
            var predicate = PredicateBuilder.New<Customer>(true);

            if (selectFilterV12Dto.Ids != null)
            {
                var customerIds = selectFilterV12Dto.Ids
                    .Where(id => Guid.TryParse(id, out _))
                    .Select(id => Guid.Parse(id))
                    .ToArray();

                if (customerIds.Length > 0)
                {
                    predicate = predicate.And(customer => customerIds.Contains(customer.Id));
                }
            }

            if (selectFilterV12Dto.SearchString != null)
            {
                predicate = predicate.And(customer =>
                    customer.Name.Contains(selectFilterV12Dto.SearchString) ||
                    customer.CustomerCode.Contains(selectFilterV12Dto.SearchString));
            }

            // Use the reusable pagination method
            var paginatedResult = await service.GetPaginatedAsync(predicate, new Paginator
            {
                Page = selectFilterV12Dto.Page,
                PageSize = selectFilterV12Dto.PageSize,
            });

            var resultToList = await paginatedResult.ToListAsync();

            PagedList<Customer> pagedResult = new PagedList<Customer>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var customerDtos = autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(customerDtos);
        }

        [HttpPost("search", Name = "SearchCustomersAsync")]
        public async Task<IActionResult> SearchCustomersAsync([FromBody] CustomerSearchDto customerSearch)
        {
            var query = context.Customers
                .AsNoTracking()
                .Include(c => c.CustomerType)
                .Where(e => e.Name.Contains(customerSearch.search) || e.CustomerCode.Contains(customerSearch.search));

            var result = await query
                .Skip((customerSearch.Page - 1) * customerSearch.PageSize)
                .Take(customerSearch.PageSize)
                .ToListAsync();

            PagedList<Customer> pagedResult = new PagedList<Customer>(result, customerSearch.Page, customerSearch.PageSize);
            var customerDtos = autoMapperService.Map<PagedListDto<CustomerDetailsDto>>(pagedResult);

            return Ok(customerDtos);
        }

        [HttpPost("count", Name = "CountCustomersAsync")]
        public async Task<IActionResult> CountCustomersAsync([FromBody] CustomerSearchDto customerSearch)
        {
            var count = await context.Customers
                .AsNoTracking()
                .Where(e => e.Name.Contains(customerSearch.search) || e.CustomerCode.Contains(customerSearch.search))
                .CountAsync();

            return Ok(count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var customer = await context.Customers
                .AsNoTracking()
                .Include(c => c.CustomerType)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
                return NotFound();

            var customerDetails = autoMapperService.Map<CustomerDetailsDto>(customer);

            return Ok(customerDetails);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CustomerCreateUpdateDto customerCreateUpdateDto)
        {
            var customer = autoMapperService.Map<Customer>(customerCreateUpdateDto);
            customer.CustomerCode = await runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.CUSTOMER);

            await service.AddAsync(customer);
            return CreatedAtAction(nameof(GetById), new { id = customer.Id }, customer);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CustomerCreateUpdateDto customerCreateUpdateDto)
        {
            var customer = await service.GetByIdAsync(id);
            if (customer == null)
                return NotFound();

            var existingCode = customer.CustomerCode;
            autoMapperService.Map(customerCreateUpdateDto, customer);
            customer.CustomerCode = existingCode;

            await service.UpdateAsync(customer);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await service.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet(Name = "FindCustomerAsync")]
        public async Task<IActionResult> FindCustomerAsync([FromQuery] CustomerFindByParametersDto customerFindByParametersDto)
        {
            var customerIdsAsString = customerFindByParametersDto.CustomerIds.Select(id => id.ToString()).ToArray();

            var customersQuery = context.Customers
                .AsNoTracking()
                .Include(c => c.CustomerType)
                .Where(e => customerIdsAsString.Contains(e.Id.ToString()));

            var result = await customersQuery
                .Skip((customerFindByParametersDto.Page - 1) * customerFindByParametersDto.PageSize)
                .Take(customerFindByParametersDto.PageSize)
                .ToListAsync();

            PagedList<Customer> pagedResult = new PagedList<Customer>(
                result,
                customerFindByParametersDto.Page,
                customerFindByParametersDto.PageSize);

            var customerDtos = autoMapperService.Map<PagedListDto<CustomerDetailsDto>>(pagedResult);

            return Ok(customerDtos);
        }
    }
}
