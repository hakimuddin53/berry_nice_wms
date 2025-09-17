using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.Expense.ExpenseDetails
{
    public class ExpenseDetailsDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; } = default!;
        public decimal Amount { get; set; }
        public string Category { get; set; } = default!;  // Freight, Internet, Staff Refreshment, etc.
        public string? Remark { get; set; }

        public DateTime CreatedAt { get; set; }
        public Guid CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public Guid? ChangedById { get; set; }
    }

    public class ExpenseFindByParametersDto : PagedRequestAbstractDto
    {
        public Guid[] ExpenseIds { get; set; } = [];
    }
}