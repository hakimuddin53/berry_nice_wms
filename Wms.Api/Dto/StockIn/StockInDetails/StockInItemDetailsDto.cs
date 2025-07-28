namespace Wms.Api.Dto.StockIn.StockInCreateUpdate
{
    public class StockInItemDetailsDto
    {
        public Guid Id { get; set; } 
        public Guid StockInId { get; set; }
        public Guid ProductId { get; set; } 

        public Guid LocationId { get; set; } 
        public int Quantity { get; set; } 
        public decimal UnitPrice { get; set; }
    }
}

