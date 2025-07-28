using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.StockReservation.StockReservationCreateUpdate
{
    public class StockReservationItemCreateUpdateDto
    {    
        public Guid ProductId { get; set; } 
        public int Quantity { get; set; }  
    }
}

