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
         
        public Guid CategoryId { get; set; }
        public Guid? BrandId { get; set; }
        public string? Model { get; set; }
        public int? Year { get; set; }
        public Guid? ColorId { get; set; }
        public Guid? StorageId { get; set; }
        public Guid? RamId { get; set; }
        public Guid? ProcessorId { get; set; }
        public Guid? ScreenSizeId { get; set; }
        public Guid? GradeId { get; set; }
        public Guid LocationId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public Guid? RegionId { get; set; }
        public Guid? NewOrUsedId { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? RetailPrice { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? DealerPrice { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? AgentPrice { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? CostPrice { get; set; }

        public string? SerialNumber { get; set; }         

        // Navigation properties
        public virtual Lookup Category { get; set; } = default!;
        public virtual Lookup? Brand { get; set; }
        public virtual Lookup? Color { get; set; }
        public virtual Lookup? Storage { get; set; }
        public virtual Lookup? Ram { get; set; }
        public virtual Lookup? Processor { get; set; }
        public virtual Lookup? ScreenSize { get; set; }
        public virtual Lookup? Grade { get; set; }
        public virtual Lookup? Region { get; set; }
        public virtual Lookup? NewOrUsed { get; set; }
        public string? Remark { get; set; }         
        public string? InternalRemark { get; set; }
    }
}
