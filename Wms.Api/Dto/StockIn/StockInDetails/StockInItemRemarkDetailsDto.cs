namespace Wms.Api.Dto.StockIn.StockInDetails
{
    public class StockInItemRemarkDetailsDto
    {
        public Guid Id { get; set; }
        public Guid StockInItemId { get; set; }
        public Guid ProductRemarkId { get; set; }
        public string Remark { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public Guid CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public Guid? ChangedById { get; set; }
    }
}
