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
        public Guid ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public ReservationItemStatusEnum Status { get; set; } = ReservationItemStatusEnum.ACTIVE;
    }
}
