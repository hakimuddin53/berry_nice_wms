using Wms.Api.Model;

namespace Wms.Api.Entities
{
    public class Lookup : CreatedChangedEntity
    {
        public Guid Id { get; set; }
        public LookupGroupKey GroupKey { get; set; }
        public string Code { get; set; } = default!;
        public string Label { get; set; } = default!;
        public int SortOrder { get; set; }
        public bool IsActive { get; set; } = true;
        public string? ParentCode { get; set; }
        public string? MetaJson { get; set; }
        public byte[]? RowVersion { get; set; }
    } 
}

