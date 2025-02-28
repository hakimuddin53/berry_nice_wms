using System.ComponentModel.DataAnnotations;
using Wms.Api.Entities;

namespace Wms.Api.Dto.StockReservation.StockReservationCreateUpdate
{
    public class StockReservationCreateUpdateDto
    { 
        public required string Number { get; set; } 
        public ICollection<StockReservationItemCreateUpdateDto>? StockReservationItems { get; set; }
    }
}
