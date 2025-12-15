using System;
using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class ProductAuditLog
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        [MaxLength(128)]
        public string PropertyName { get; set; } = default!;

        public string? OldValue { get; set; }

        public string? NewValue { get; set; }

        [Required]
        [MaxLength(128)]
        public string ChangedBy { get; set; } = "System";

        [Required]
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    }
}
