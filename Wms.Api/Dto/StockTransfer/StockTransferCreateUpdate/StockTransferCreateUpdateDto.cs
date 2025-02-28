using Wms.Api.Entities;

namespace Wms.Api.Dto.StockTransfer.StockTransferCreateUpdateDto
{
    public class StockTransferCreateUpdateDto 
    {  
        public required string Number { get; set; }

        // Navigation Property
        public ICollection<StockTransferItemCreateUpdateDto>? StockTransferItems { get; set; }
    }
}
