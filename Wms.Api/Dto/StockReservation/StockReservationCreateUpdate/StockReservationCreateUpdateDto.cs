using Wms.Api.Model;

namespace Wms.Api.Dto.StockReservation.StockReservationCreateUpdate
{
    public class StockReservationCreateUpdateDto
    { 
        public required string Number { get; set; }
        public Guid WarehouseId { get; set; }
        public DateTime ReservedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public required string Status { get; set; }
        public string? CancellationRemark { get; set; }
        public string? CancellationRequestedBy { get; set; }
        public DateTime? CancellationRequestedAt { get; set; }
        public string? CancellationApprovedBy { get; set; }
        public DateTime? CancellationApprovedAt { get; set; }
        public ICollection<StockReservationItemCreateUpdateDto>? StockReservationItems { get; set; }
    }
}
