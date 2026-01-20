using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class Customer : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string CustomerCode { get; set; } = default!;
        [Required]
        public string Name { get; set; } = default!;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        [Required]
        public Guid CustomerTypeId { get; set; }

        // Navigation
        public virtual Lookup CustomerType { get; set; } = default!;
    }
}
