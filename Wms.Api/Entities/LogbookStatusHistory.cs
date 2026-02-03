using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public class LogbookStatusHistory
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid LogbookEntryId { get; set; }

        [Required]
        public Guid LogbookStatusId { get; set; }

        [ForeignKey(nameof(LogbookStatusId))]
        public Lookup LogbookStatus { get; set; } = default!;

        [MaxLength(512)]
        public string? Remark { get; set; }

        [Required]
        [MaxLength(128)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(LogbookEntryId))]
        public LogbookEntry? LogbookEntry { get; set; }
    }
}
