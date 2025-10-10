using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public class StockInItem : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StockInId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public Guid LocationId { get; set; }

        public string? PrimarySerialNumber { get; set; }

        public string? ManufactureSerialNumber { get; set; }

        public string? Region { get; set; }

        public string? Condition { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? RetailSellingPrice { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? DealerSellingPrice { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? AgentSellingPrice { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? Cost { get; set; }

        public string? Remarks { get; set; }

        public string? ItemsIncluded { get; set; }

        [Required]
        public int ReceiveQuantity { get; set; }

        // Navigation properties
        [ForeignKey("StockInId")]
        public StockIn? StockIn { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
    }
}
