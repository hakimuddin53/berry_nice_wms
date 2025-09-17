using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Dto.Product.ProductDetails
{
    public class ProductDetailsDto
    {
        public Guid ProductId { get; set; }
        [Required]
        public string Sku { get; set; } = default!;
        
        // Foreign keys
        public Guid CategoryId { get; set; }
        public Guid? BrandId { get; set; }
        public Guid? ModelId { get; set; }
        public Guid? ColorId { get; set; }
        public Guid? StorageId { get; set; }
        public Guid? RamId { get; set; }
        public Guid? ProcessorId { get; set; }
        public Guid? ScreenSizeId { get; set; }
        
        // Display names from lookups
        public string Category { get; set; } = default!;
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? Color { get; set; }
        public string? Storage { get; set; }
        public string? Ram { get; set; }
        public string? Processor { get; set; }
        public string? ScreenSize { get; set; }
        
        public bool HasSerial { get; set; }   // true = track by serial, false = track by qty

        // Embedded prices (no ProductPrice table needed)
        [Column(TypeName = "decimal(18,2)")]
        public decimal RetailPrice { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal DealerPrice { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal AgentPrice { get; set; }

        public int LowQty { get; set; } = 0;
        public DateTime CreatedDate { get; set; }
    }

    public class ProductFindByParametersDto : PagedRequestAbstractDto
    {
        public int[] ProductIds { get; set; } = [];
    }
}
