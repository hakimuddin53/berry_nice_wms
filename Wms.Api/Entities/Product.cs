using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public class Product
    {
        [Key]
        public Guid ProductId { get; set; }
        [Required]
        public string Sku { get; set; } = default!;
        
        // Foreign keys to Lookup table
        public Guid CategoryId { get; set; }
        public Guid? BrandId { get; set; }
        public Guid? ModelId { get; set; }
        public Guid? ColorId { get; set; }
        public Guid? StorageId { get; set; }
        public Guid? RamId { get; set; }
        public Guid? ProcessorId { get; set; }
        public Guid? ScreenSizeId { get; set; }
        
        public bool HasSerial { get; set; }   // true = track by serial, false = track by qty

        // Embedded prices (no ProductPrice table needed)
        [Column(TypeName = "decimal(18,2)")]
        public decimal RetailPrice { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal DealerPrice { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal AgentPrice { get; set; }

        public int LowQty { get; set; } = 0;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual Lookup Category { get; set; } = default!;
        public virtual Lookup? Brand { get; set; }
        public virtual Lookup? Model { get; set; }
        public virtual Lookup? Color { get; set; }
        public virtual Lookup? Storage { get; set; }
        public virtual Lookup? Ram { get; set; }
        public virtual Lookup? Processor { get; set; }
        public virtual Lookup? ScreenSize { get; set; }
    }
}

