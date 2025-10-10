namespace Wms.Api.Dto.StockIn.StockInCreateUpdate
{
    public class StockInCreateUpdateDto
    {
        public required string Number { get; set; }
        public required string SellerInfo { get; set; }
        public required string Purchaser { get; set; }
        public required string Location { get; set; }
        public DateTime DateOfPurchase { get; set; }
        public Guid WarehouseId { get; set; }
        public ICollection<StockInItemCreateUpdateDto>? StockInItems { get; set; }
    }
}