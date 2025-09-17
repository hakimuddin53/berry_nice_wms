using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class Expense : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Description { get; set; } = default!;
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public string Category { get; set; } = default!;  // Freight, Internet, Staff Refreshment, etc.
        public string? Remark { get; set; }
    }
}