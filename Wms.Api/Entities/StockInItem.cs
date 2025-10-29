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
    [MaxLength(64)]
    public string ProductCode { get; set; } = default!;

    [Required]
    public Guid CategoryId { get; set; }

        public Guid? BrandId { get; set; }

        public string? Model { get; set; }

        public Guid? ColorId { get; set; }

        public Guid? StorageId { get; set; }

        public Guid? RamId { get; set; }

        public Guid? ProcessorId { get; set; }

        public Guid? ScreenSizeId { get; set; }

        [Required]
        public Guid LocationId { get; set; }

        public string? PrimarySerialNumber { get; set; }

        public string? ManufactureSerialNumber { get; set; }

        public string? Region { get; set; }

        [Column("Condition")]
        public string? NewOrUsed { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? RetailSellingPrice { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? DealerSellingPrice { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? AgentSellingPrice { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? Cost { get; set; }

        public string? ItemsIncluded { get; set; }

        [Required]
        public int ReceiveQuantity { get; set; }

        // Navigation properties
        [ForeignKey("StockInId")]
        public StockIn? StockIn { get; set; }

        public ICollection<StockInItemRemark>? StockInItemRemarks { get; set; }
    }
}
