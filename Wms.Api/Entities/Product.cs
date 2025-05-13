using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wms.Api.Model;

namespace Wms.Api.Entities
{
    public class Product : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public required string SerialNumber { get; set; }
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string ItemCode { get; set; }         

        [Required]
        public Guid ClientCodeId { get; set; }

        [Required]
        public int QuantityPerCarton { get; set; }  
        public Guid CategoryId { get; set; }   
        public Guid SizeId { get; set; }  
        public Guid ColourId { get; set; }  
        public Guid DesignId { get; set; } 
        public Guid CartonSizeId { get; set; }
        public string? ProductPhotoUrl { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,5)")]
        public decimal ListPrice { get; set; }
        public int Threshold { get; set; }

    }
}

