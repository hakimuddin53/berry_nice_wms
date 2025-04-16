 

namespace Wms.Api.Dto.StockTransfer.StockTransferDetails
{
    public class StockTransferItemDetailsDto
    {
        public Guid Id { get; set; }
        public required string StockTransferItemNumber { get; set; }
        public Guid ProductId { get; set; }
        public string Product { get; set; }
        public int QuantityTransferred { get; set; }
        public Guid FromWarehouseId { get; set; } // Source warehouse
        public string FromWarehouse { get; set; } // Source warehouse
        public Guid ToWarehouseId { get; set; } // Destination warehouse
        public string ToWarehouse { get; set; } // Destination warehouse

        public DateTime CreatedAt { get; set; }
        public required string CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public string? ChangedById { get; set; }
    }
}
