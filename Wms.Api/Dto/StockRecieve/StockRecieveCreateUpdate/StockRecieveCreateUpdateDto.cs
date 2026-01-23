namespace Wms.Api.Dto.StockRecieve.StockRecieveCreateUpdate
{
    public class StockRecieveCreateUpdateDto
    {
        public required string SellerInfo { get; set; }
        public required string Purchaser { get; set; }
        public DateTime DateOfPurchase { get; set; }
        public string? InvoiceNumber { get; set; }
        public Guid WarehouseId { get; set; }
        public ICollection<StockRecieveItemCreateUpdateDto>? StockRecieveItems { get; set; }
    }
}
