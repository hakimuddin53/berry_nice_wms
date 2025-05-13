using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.StockTransfer.StockTransferCreateUpdateDto
{
    public class StockTransferItemCreateUpdateDto
    {
        public Guid ProductId { get; set; }
        public int QuantityTransferred { get; set; }

        public Guid FromLocationId { get; set; }  
        public Guid ToLocationId { get; set; }  
        public Guid FromWarehouseId { get; set; }  
        public Guid ToWarehouseId { get; set; }  
    }
}
