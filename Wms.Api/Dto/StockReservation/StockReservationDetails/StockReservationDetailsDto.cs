using System.ComponentModel.DataAnnotations;
using Wms.Api.Model;

namespace Wms.Api.Dto.StockReservation.StockReservationDetails
{
    public class StockReservationDetailsDto
    { 
        public Guid Id { get; set; }
        public required string Number { get; set; }
        public DateTime ReservedAt { get; set; } 
        public DateTime ExpiresAt { get; set; }
        public ReservationStatusEnum Status { get; set; }
        public string? CancellationRemark { get; set; }
        public string? CancellationRequestedBy { get; set; }
        public DateTime? CancellationRequestedAt { get; set; }
        public string? CancellationApprovedBy { get; set; }
        public DateTime? CancellationApprovedAt { get; set; }
        public Guid WarehouseId { get; set; }
        public string Warehouse { get; set; }
        public DateTime CreatedAt { get; set; }
        public required string CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public string? ChangedById { get; set; }
        public ICollection<StockReservationItemDetailsDto>? StockReservationItems { get; set; }
    } 
}
