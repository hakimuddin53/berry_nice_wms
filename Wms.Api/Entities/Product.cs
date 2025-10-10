using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public class Product
    {
        [Key]
        public Guid ProductId { get; set; }
        [Required]
        public string ProductCode { get; set; } = default!;
        
        // Foreign keys to Lookup table
        public Guid CategoryId { get; set; }
        public Guid? BrandId { get; set; }
        public string? Model { get; set; }
        public Guid? ColorId { get; set; }
        public Guid? StorageId { get; set; }
        public Guid? RamId { get; set; }
        public Guid? ProcessorId { get; set; }
        public Guid? ScreenSizeId { get; set; }
        
        public int LowQty { get; set; } = 0;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual Lookup Category { get; set; } = default!;
        public virtual Lookup? Brand { get; set; }
        public virtual Lookup? Color { get; set; }
        public virtual Lookup? Storage { get; set; }
        public virtual Lookup? Ram { get; set; }
        public virtual Lookup? Processor { get; set; }
        public virtual Lookup? ScreenSize { get; set; }
    }
}

