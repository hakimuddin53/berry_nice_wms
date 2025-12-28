using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class StockTake : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Number { get; set; } = default!;

        [Required]
        public Guid WarehouseId { get; set; }

        public DateTime TakenAt { get; set; } = DateTime.UtcNow;

        public string? Remark { get; set; }

        public ICollection<StockTakeItem> Items { get; set; } = new List<StockTakeItem>();
    }
}
