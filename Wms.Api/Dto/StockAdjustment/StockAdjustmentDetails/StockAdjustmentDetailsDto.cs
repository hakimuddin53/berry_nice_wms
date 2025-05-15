using Wms.Api.Dto.StockAdjustment.StockAdjustmentDetails;

namespace Wms.Api.Dto.StockAdjustment.StockAdjustmentCreateUpdate
{
    public class StockAdjustmentDetailsDto
    {
        public Guid Id { get; set; }
        public required string Number { get; set; } 
        public Guid WarehouseId { get; set; }
        public DateTime CreatedAt { get; set; }
        public required string CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public string? ChangedById { get; set; }
        public ICollection<StockAdjustmentItemDetailsDto>? StockAdjustmentItems { get; set; }
    }
}
