using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class StockTransferItem : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StockTransferId { get; set; }

        [Required]
        public required string StockTransferItemNumber { get; set; }

        [Required]
        public Guid ProductId { get; set; }
        public string Product { get; set; }

        [Required]
        public int QuantityTransferred { get; set; }

        [Required]
        public Guid FromWarehouseId { get; set; } // Source warehouse
        public string FromWarehouse { get; set; }  

        [Required]
        public Guid ToWarehouseId { get; set; } // Destination warehouse
        public string ToWarehouse { get; set; } 
    }
}
