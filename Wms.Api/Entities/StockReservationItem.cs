using System.ComponentModel.DataAnnotations;
using Wms.Api.Model;

namespace Wms.Api.Entities
{
    public class StockReservationItem : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid StockReservationId { get; set; }

        [Required]
        public required string StockReservationItemNumber { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public DateTime ReservationDate { get; set; } // Date when the reservation was made

        [Required]
        public DateTime ExpirationDate { get; set; } // Date when the reservation expires

    }
}
