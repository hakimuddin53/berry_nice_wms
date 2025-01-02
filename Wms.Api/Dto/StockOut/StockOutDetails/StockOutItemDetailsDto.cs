namespace Wms.Api.Dto.StockOut.StockOutDetails
{
    public class StockOutItemDetailsDto
    {
        public Guid Id { get; set; } 
        public Guid StockOutId { get; set; }
        public required string StockOutItemNumber { get; set; } 
        public Guid ProductId { get; set; } 
        public int Quantity { get; set; } 
        public Guid ProductUomId { get; set; } 
        public decimal ListPrice { get; set; }
    }
}

