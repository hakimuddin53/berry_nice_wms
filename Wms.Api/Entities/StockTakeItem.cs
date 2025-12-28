using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class StockTakeItem : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StockTakeId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public int CountedQuantity { get; set; }

        [Required]
        public int SystemQuantity { get; set; }

        [Required]
        public int DifferenceQuantity { get; set; }

        public string? Remark { get; set; }

        public StockTake? StockTake { get; set; }
        public Product? Product { get; set; }
    }
}
