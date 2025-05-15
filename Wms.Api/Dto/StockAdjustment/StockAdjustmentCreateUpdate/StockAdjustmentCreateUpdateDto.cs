using Wms.Api.Dto.StockAdjustment.StockAdjustmentCreateUpdate;

namespace Wms.Api.Dto.StockAdjustment.StockAdjustmentCreateUpdateDto
{
    public class StockAdjustmentCreateUpdateDto 
    { 
        public required string Number { get; set; } 
        public Guid WarehouseId { get; set; }
        public ICollection<StockAdjustmentItemCreateUpdateDto>? StockAdjustmentItems { get; set; }
    }
}
