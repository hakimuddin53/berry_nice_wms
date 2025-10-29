namespace Wms.Api.Dto.StockIn.StockInDetails
{
    public class StockInDetailsDto
    {
        public Guid Id { get; set; }
        public required string Number { get; set; }
        public required string SellerInfo { get; set; }
        public required string Purchaser { get; set; }
        public DateTime DateOfPurchase { get; set; }
        public Guid WarehouseId { get; set; }
        public string WarehouseLabel { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public required string CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public string? ChangedById { get; set; }

        public ICollection<StockInItemDetailsDto>? StockInItems { get; set; }
    }
}
