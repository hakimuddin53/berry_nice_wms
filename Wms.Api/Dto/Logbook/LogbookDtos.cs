using System.ComponentModel.DataAnnotations;
using Wms.Api.Dto;
using Wms.Api.Entities;

namespace Wms.Api.Dto.Logbook
{
    public class LogbookSearchDto : PagedRequestAbstractDto
    {
        public string? Search { get; set; }
        public string? Status { get; set; }
        public DateTime? FromDateUtc { get; set; }
        public DateTime? ToDateUtc { get; set; }
    }

    public class LogbookCreateDto
    {
        [Required]
        public string Barcode { get; set; } = string.Empty;

        public Guid? ProductId { get; set; }

        public string? UserName { get; set; }

        public string? Purpose { get; set; }

        public string? Status { get; set; }

        public DateTime? DateUtc { get; set; }
    }

    public class LogbookUpdateDto
    {
        public string? UserName { get; set; }
        public string? Purpose { get; set; }
        public string? Status { get; set; }
        public DateTime? DateUtc { get; set; }
    }

    public class LogbookDetailsDto
    {
        public Guid Id { get; set; }
        public DateTime DateUtc { get; set; }
        public string Barcode { get; set; } = string.Empty;
        public Guid? ProductId { get; set; }
        public string? ProductCode { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string? Purpose { get; set; }
        public string Status { get; set; } = LogbookStatus.OUT.ToString();
        public DateTime StatusChangedAt { get; set; }
        public List<LogbookStatusHistoryDto> History { get; set; } = new();
    }

    public class LogbookAvailabilityDto
    {
        public Guid ProductId { get; set; }
        public string ProductCode { get; set; } = string.Empty;
        public string? UserName { get; set; }
        public string? Remark { get; set; }
        public string? Status { get; set; }
        public DateTime? StatusChangedAt { get; set; }
        public Guid? LogbookEntryId { get; set; }
    }

    public class LogbookStatusHistoryDto
    {
        public Guid Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Remark { get; set; }
        public string UserName { get; set; } = string.Empty;
        public DateTime ChangedAt { get; set; }
    }
}
