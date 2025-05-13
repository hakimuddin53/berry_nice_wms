namespace Wms.Api.Dto.StockAdjustment.StockAdjustmentDetails
{
    public class StockAdjustmentItemDetailsDto
    {
        public Guid Id { get; set; } 
        public Guid StockAdjustmentId { get; set; }
        public Guid ProductId { get; set; }
        public string Product { get; set; }
        public int Quantity { get; set; }   
    }
}

