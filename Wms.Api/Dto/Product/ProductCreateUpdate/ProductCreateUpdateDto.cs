using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Dto.Product.ProductCreateUpdate
{
    public class ProductCreateUpdateDto
    {
        [Required]
        public string ProductCode { get; set; } = default!;
        
        // Foreign keys to Lookup table
        [Required]
        public Guid CategoryId { get; set; }
        public Guid? BrandId { get; set; }
        public string? Model { get; set; }
        public Guid? ColorId { get; set; }
        public Guid? StorageId { get; set; }
        public Guid? RamId { get; set; }
        public Guid? ProcessorId { get; set; }
        public Guid? ScreenSizeId { get; set; }

        public int LowQty { get; set; } = 0;
    }
}
