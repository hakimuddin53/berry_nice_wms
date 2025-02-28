using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.StockReservation.StockReservationDetails
{
    public class StockReservationDetailsDto
    { 
        public Guid Id { get; set; }
        public required string Number { get; set; }
        public ICollection<StockReservationItemDetailsDto>? StockReservationItems { get; set; }

        public DateTime CreatedAt { get; set; }
        public required string CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public string? ChangedById { get; set; }
    }
}
