using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class StockReservation : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public string? SalesPicName { get; set; }

        [Required]
        public string? ClientCustomerName { get; set; }

        // Navigation Properties
        public Product Product { get; set; }

        [Required]
        public DateTime ReservationDate { get; set; } // Date when the reservation was made

        [Required]
        public DateTime ExpirationDate { get; set; } // Date when the reservation expires

    }
}
