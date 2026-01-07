using System.Text.Json.Serialization;
using Wms.Api.Model;

namespace Wms.Api.Dto.Lookup
{      
    public class LookupDetailsDto
    {
        public Guid Id { get; init; }
        public LookupGroupKey GroupKey { get; init; }
        public string Label { get; init; }
        public int SortOrder { get; init; }
        public bool IsActive { get; init; }
        public DateTime CreatedAt { get; init; }
        public Guid CreatedById { get; init; }
        public DateTime? ChangedAt { get; init; }
        public Guid? ChangedById { get; init; }
    }
    public class LookupCreateUpdateDto
    {
        public LookupGroupKey GroupKey { get; init; }
        public string Label { get; init; }
        public int SortOrder { get; init; }
        public bool IsActive { get; init; }
    }

    // Changed from 'record' to 'class' to fix CS8864
    public class LookupSearchDto : PagedRequestAbstractDto
    {
         
        public string GroupKey { get; init; }
        public string? Search { get; init; }
        public bool ActiveOnly { get; init; } = true;
    }
}
