namespace Wms.Api.Dto.StockTransfer
{
    public class StockTransferDetailsDto
    {
        public Guid Id { get; set; }
        public string Number { get; set; } = default!;
        public Guid ProductId { get; set; }
        public string? ProductCode { get; set; }
        public int QuantityTransferred { get; set; }
        public Guid FromWarehouseId { get; set; }
        public string? FromWarehouseName { get; set; }
        public Guid ToWarehouseId { get; set; }
        public string? ToWarehouseName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
