using System.ComponentModel.DataAnnotations;
using Wms.Api.Dto.StockReservation.StockReservationDetails;
using Wms.Api.Model;

namespace Wms.Api.Entities
{
    public class StockReservation : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Number { get; set; }

        [Required]
        public Guid WarehouseId { get; set; }
        public DateTime ReservedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public ReservationStatusEnum Status { get; set; }
        public string? CancellationRemark { get; set; }
        public string? CancellationRequestedBy { get; set; }
        public DateTime? CancellationRequestedAt { get; set; }
        public string? CancellationApprovedBy { get; set; }
        public DateTime? CancellationApprovedAt { get; set; }
         
        public ICollection<StockReservationItem>? StockReservationItems { get; set; }
    }
}
