using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class Product
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string ItemCode { get; set; }

        [Required]
        public required string ClientCode { get; set; }

        [Required]
        public required string WarehouseCode { get; set; }

        public string Category { get; set; } = string.Empty;
        public string SubCategory { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public string Colour { get; set; } = string.Empty;
        public string ItemType { get; set; } = string.Empty; // e.g., Long Sleeve, Short Sleeve
        public string ProductPhotoUrl { get; set; } = string.Empty;

        // Navigation Property
        public ICollection<ProductUom> ProductUoms { get; set; }
    }
}
