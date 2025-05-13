namespace Wms.Api.Dto.StockAdjustment.StockAdjustmentCreateUpdate
{
    public class StockAdjustmentItemCreateUpdateDto
    { 
        public Guid ProductId { get; set; } 
        public int Quantity { get; set; }   
    }
}

