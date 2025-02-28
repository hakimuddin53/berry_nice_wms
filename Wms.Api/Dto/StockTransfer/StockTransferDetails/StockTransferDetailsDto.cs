 namespace Wms.Api.Dto.StockTransfer.StockTransferDetails
{
    public class StockTransferDetailsDto
    {
        public required string Number { get; set; }

        // Navigation Property
        public ICollection<StockTransferItemDetailsDto>? StockTransferItems { get; set; }
    }
}
