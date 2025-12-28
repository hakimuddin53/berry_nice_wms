namespace Wms.Api.Dto.Product
{
    public class ProductAuditLogDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string PropertyName { get; set; } = default!;
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public string ChangedBy { get; set; } = default!;
        public DateTime ChangedAt { get; set; }
    }
}
