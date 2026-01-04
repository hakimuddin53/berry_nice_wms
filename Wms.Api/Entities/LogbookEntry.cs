using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public enum LogbookStatus
    {
        OUT = 0,
        RETURNED = 1
    }

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
        public LogbookStatus Status { get; set; } = LogbookStatus.OUT;

        [Required]
        public DateTime StatusChangedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }

        public ICollection<LogbookStatusHistory> StatusHistory { get; set; } = new List<LogbookStatusHistory>();
    }
}
