namespace Wms.Api.Dto.StockRecieve.StockRecieveDetails
{
    public class StockRecieveItemRemarkDetailsDto
    {
        public Guid Id { get; set; }
        public Guid StockRecieveItemId { get; set; }
        public Guid ProductRemarkId { get; set; }
        public string Remark { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public Guid CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public Guid? ChangedById { get; set; }
    }
}

