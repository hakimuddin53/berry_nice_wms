namespace Wms.Api.Dto.StockIn.StockInCreateUpdate
{
    public class StockInItemDetailsDto
    {
        public Guid Id { get; set; } 
        public Guid StockInId { get; set; }
        public required string StockInItemNumber { get; set; } 
        public Guid ProductId { get; set; } 
        public int Quantity { get; set; } 
        public Guid ProductUomId { get; set; } 
        public decimal ListPrice { get; set; }
    }
}

