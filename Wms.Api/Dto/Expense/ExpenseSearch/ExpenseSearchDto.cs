namespace Wms.Api.Dto.Expense.ExpenseSearch
{
    public class ExpenseSearchDto : PagedRequestAbstractDto
    {
        public string search { get; set; } = default!;
    }
}