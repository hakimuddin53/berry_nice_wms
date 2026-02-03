using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public class LogbookEntry : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public DateTime DateUtc { get; set; }

        [Required]
        [MaxLength(128)]
        public string Barcode { get; set; } = string.Empty;

        public Guid? ProductId { get; set; }

        [Required]
        [MaxLength(128)]
        public string UserName { get; set; } = string.Empty;

        [MaxLength(512)]
        public string? Purpose { get; set; }

        [Required]
        public Guid LogbookStatusId { get; set; }

        [ForeignKey(nameof(LogbookStatusId))]
        public Lookup LogbookStatus { get; set; } = default!;

        [Required]
        public DateTime StatusChangedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }

        public ICollection<LogbookStatusHistory> StatusHistory { get; set; } = new List<LogbookStatusHistory>();
    }
}
