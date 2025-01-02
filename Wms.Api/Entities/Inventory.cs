using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class Inventory : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public Guid ProductUomId { get; set; } // Unit of Measurement reference

        [Required]
        public Guid WarehouseId { get; set; }

        [Required]
        public int QuantityIn { get; set; } // Quantity added in the transaction

        [Required]
        public int QuantityOut { get; set; } // Quantity removed in the transaction

        [Required]
        public int OldBalance { get; set; } // Balance before the transaction

        [Required]
        public int NewBalance { get; set; } // Balance after the transaction 
        [Required]
        public string RecStatus { get; set; } // Status of the record (e.g., Active/Inactive)
    }
}
