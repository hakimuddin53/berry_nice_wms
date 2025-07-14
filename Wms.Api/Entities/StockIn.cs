using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class StockIn : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Number { get; set; }

        [Required]
        public required string PONumber { get; set; }

        [Required]
        public required string FromLocation { get; set; }

        [Required]
        public Guid WarehouseId { get; set; }

        public ICollection<StockInItem>? StockInItems { get; set; }
    }
}
