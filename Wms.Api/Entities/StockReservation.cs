using System.ComponentModel.DataAnnotations;
using Wms.Api.Model;

namespace Wms.Api.Entities
{
    public class StockReservation : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Number { get; set; }

        // Navigation Property
        public ICollection<StockReservationItem>? StockReservationItems { get; set; }
    }
}
