using AutoMapper;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.Expense.ExpenseCreateUpdate;
using Wms.Api.Dto.Expense.ExpenseDetails;
using Wms.Api.Dto.Expense.ExpenseSearch;
using Wms.Api.Dto.PagedList;
using Wms.Api.Entities;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ExpenseController(
        IService<Expense> service,
        IMapper autoMapperService,
        ApplicationDbContext context)
        : ControllerBase
    {
        [HttpGet("select-options")]
        [ProducesResponseType(typeof(PagedListDto<SelectOptionV12Dto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSelectOptionsAsync([FromQuery] GlobalSelectFilterV12Dto selectFilterV12Dto)
        {
            // Build the filter expression
            var predicate = PredicateBuilder.New<Expense>(true);

            if (selectFilterV12Dto.Ids != null)
            {
                var expenseIds = selectFilterV12Dto.Ids
                    .Where(id => Guid.TryParse(id, out _))
                    .Select(id => Guid.Parse(id))
                    .ToArray();

                if (expenseIds.Length > 0)
                {
                    predicate = predicate.And(expense => expenseIds.Contains(expense.Id));
                }
            }

            if (selectFilterV12Dto.SearchString != null)
            {
                predicate = predicate.And(expense =>
                    expense.Description.Contains(selectFilterV12Dto.SearchString) ||
                    expense.Category.Contains(selectFilterV12Dto.SearchString));
            }

            // Use the reusable pagination method
            var paginatedResult = await service.GetPaginatedAsync(predicate, new Paginator
            {
                Page = selectFilterV12Dto.Page,
                PageSize = selectFilterV12Dto.PageSize,
            });

            var resultToList = await paginatedResult.ToListAsync();

            PagedList<Expense> pagedResult = new PagedList<Expense>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var expenseDtos = autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(expenseDtos);
        }

        [HttpPost("search", Name = "SearchExpensesAsync")]
        public async Task<IActionResult> SearchExpensesAsync([FromBody] ExpenseSearchDto expenseSearch)
        {
            var expenses = await service.GetAllAsync(e => e.Description.Contains(expenseSearch.search) || e.Category.Contains(expenseSearch.search));

            var result = expenses.Skip((expenseSearch.Page - 1) * expenseSearch.PageSize).Take(expenseSearch.PageSize).ToList();

            PagedList<Expense> pagedResult = new PagedList<Expense>(result, expenseSearch.Page, expenseSearch.PageSize);

            var expenseDtos = autoMapperService.Map<PagedListDto<ExpenseDetailsDto>>(pagedResult);

            return Ok(expenseDtos);
        }

        [HttpPost("count", Name = "CountExpensesAsync")]
        public async Task<IActionResult> CountExpensesAsync([FromBody] ExpenseSearchDto expenseSearch)
        {
            var expenses = await service.GetAllAsync(e => e.Description.Contains(expenseSearch.search) || e.Category.Contains(expenseSearch.search));

            var expenseDtos = autoMapperService.Map<List<ExpenseDetailsDto>>(expenses);
            return Ok(expenseDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var expense = await service.GetByIdAsync(id);

            if (expense == null)
                return NotFound();

            var expenseDetails = autoMapperService.Map<ExpenseDetailsDto>(expense);

            return Ok(expenseDetails);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ExpenseCreateUpdateDto expenseCreateUpdateDto)
        {
            var expense = autoMapperService.Map<Expense>(expenseCreateUpdateDto);

            await service.AddAsync(expense);
            return CreatedAtAction(nameof(GetById), new { id = expense.Id }, expense);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ExpenseCreateUpdateDto expenseCreateUpdateDto)
        {
            var expense = await service.GetByIdAsync(id);
            if (expense == null)
                return NotFound();

            autoMapperService.Map(expenseCreateUpdateDto, expense);

            await service.UpdateAsync(expense);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await service.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet(Name = "FindExpenseAsync")]
        public async Task<IActionResult> FindExpenseAsync([FromQuery] ExpenseFindByParametersDto expenseFindByParametersDto)
        {
            var expenseIdsAsString = expenseFindByParametersDto.ExpenseIds.Select(id => id.ToString()).ToArray();

            var expensesQuery = await service.GetAllAsync(e => expenseIdsAsString.Contains(e.Id.ToString()));

            var result = expensesQuery
                .Skip((expenseFindByParametersDto.Page - 1) * expenseFindByParametersDto.PageSize)
                .Take(expenseFindByParametersDto.PageSize)
                .ToList();

            PagedList<Expense> pagedResult = new PagedList<Expense>(
                result,
                expenseFindByParametersDto.Page,
                expenseFindByParametersDto.PageSize);

            var expenseDtos = autoMapperService.Map<PagedListDto<ExpenseDetailsDto>>(pagedResult);

            return Ok(expenseDtos);
        }
    }
}