using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.StockTransfer.StockTransferCreateUpdateDto
{
    public class StockTransferItemCreateUpdateDto
    {
        public required string StockTransferItemNumber { get; set; }
        public Guid ProductId { get; set; }
        public int QuantityTransferred { get; set; }
        public Guid FromWarehouseId { get; set; } // Source warehouse
        public Guid ToWarehouseId { get; set; } // Destination warehouse
    }
}
