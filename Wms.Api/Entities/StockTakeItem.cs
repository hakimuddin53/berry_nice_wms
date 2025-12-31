using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class StockTakeItem : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StockTakeId { get; set; }

        public Guid? ProductId { get; set; }

        public int CountedQuantity { get; set; }

        public int SystemQuantity { get; set; }

        public int DifferenceQuantity { get; set; }

        public string? ScannedBarcode { get; set; }

        public string? Remark { get; set; }

        public StockTake? StockTake { get; set; }
        public Product? Product { get; set; }
    }
}
