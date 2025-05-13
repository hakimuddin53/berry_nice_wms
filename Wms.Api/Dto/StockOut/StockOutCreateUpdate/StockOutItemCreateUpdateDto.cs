namespace Wms.Api.Dto.StockOut.StockOutCreateUpdate
{
    public class StockOutItemCreateUpdateDto
    { 
        public Guid ProductId { get; set; } 
        public int Quantity { get; set; }   
    }
}

