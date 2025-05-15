 

namespace Wms.Api.Dto.StockTransfer.StockTransferDetails
{
    public class StockTransferItemDetailsDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; } 
        public int QuantityTransferred { get; set; }
        
        public Guid FromLocationId { get; set; }   
 
        public Guid ToLocationId { get; set; }   
        
        public Guid FromWarehouseId { get; set; } // Source warehouse 
        public Guid ToWarehouseId { get; set; } // Destination warehouse 

        public DateTime CreatedAt { get; set; }
        public required string CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public string? ChangedById { get; set; }
    }
}
