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
        public Guid ProductId { get; set; } 

        [Required]
        public int QuantityTransferred { get; set; }
        
        [Required]
        public Guid FromLocationId { get; set; }   

        [Required]
        public Guid ToLocationId { get; set; }   

        [Required]
        public Guid FromWarehouseId { get; set; } // Source warehouse 

        [Required]
        public Guid ToWarehouseId { get; set; } // Destination warehouse 
    }
}
