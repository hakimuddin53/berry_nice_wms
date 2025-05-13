namespace Wms.Api.Dto.StockOut.StockOutDetails
{
    public class StockOutItemDetailsDto
    {
        public Guid Id { get; set; } 
        public Guid StockOutId { get; set; }
        public Guid ProductId { get; set; }
        public string Product { get; set; }
        public int Quantity { get; set; }   
    }
}

