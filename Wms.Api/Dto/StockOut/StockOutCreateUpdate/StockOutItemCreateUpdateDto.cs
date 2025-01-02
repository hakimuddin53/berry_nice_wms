namespace Wms.Api.Dto.StockOut.StockOutCreateUpdate
{
    public class StockOutItemCreateUpdateDto
    { 
        public required string StockOutItemNumber { get; set; } 
        public Guid ProductId { get; set; } 
        public int Quantity { get; set; } 
        public Guid ProductUomId { get; set; } 
        public decimal ListPrice { get; set; }
    }
}

