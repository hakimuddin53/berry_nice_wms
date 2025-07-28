using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public class WarehouseInventoryBalance : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid ProductId { get; set; }
        [Required]
        public Guid WarehouseId { get; set; }

        /// <summary>Total on-hand across all locations in this warehouse.</summary>
        public int OnHandQuantity { get; set; } = 0;

        /// <summary>Units that have been explicitly reserved.</summary>
        public int ReservedQuantity { get; set; } = 0;

        /// <summary>How many you can still allocate (on-hand minus reserved).</summary>
        [NotMapped]
        public int AvailableForPicking => OnHandQuantity - ReservedQuantity;

        /// <summary>Sum of all receipts (qty) – for weighted-average cost.</summary>
        public int TotalQtyReceived { get; set; } = 0;

        /// <summary>Sum of (qty × unitCost) – for weighted-average cost.</summary>
        [Column(TypeName = "decimal(18,4)")]
        public decimal TotalCostAccumulated { get; set; } = 0m;

        [NotMapped]
        public decimal AverageCost
          => TotalQtyReceived > 0
             ? TotalCostAccumulated / TotalQtyReceived
             : 0m;
    }
}
