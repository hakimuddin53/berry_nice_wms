using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.StockReservation.StockReservationDetails
{
    public class StockReservationItemDetailsDto
    {  
        public Guid Id { get; set; } 
        public Guid StockReservationId { get; set; }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}

