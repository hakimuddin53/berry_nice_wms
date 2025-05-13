using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class StockAdjustment : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Number { get; set; } 

        [Required]
        public Guid WarehouseId { get; set; }

        [Required]
        public Guid LocationId { get; set; }

        // Navigation Property
        public ICollection<StockAdjustmentItem>? StockAdjustmentItems { get; set; }
    }
}
