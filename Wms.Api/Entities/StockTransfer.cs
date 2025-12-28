using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class StockTransfer : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Number { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public int QuantityTransferred { get; set; }

        [Required]
        public Guid FromWarehouseId { get; set; }

        [Required]
        public Guid ToWarehouseId { get; set; }

        public Product? Product { get; set; }
    }
}
