 namespace Wms.Api.Dto.StockTransfer.StockTransferDetails
{
    public class StockTransferDetailsDto
    {
        public Guid Id { get; set; }
        public required string Number { get; set; }

        public DateTime CreatedAt { get; set; }
        public required string CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public string? ChangedById { get; set; }

        // Navigation Property
        public ICollection<StockTransferItemDetailsDto>? StockTransferItems { get; set; }
    }
}
