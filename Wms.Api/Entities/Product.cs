using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class Product : CreatedChangedEntity
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
        public required Guid WarehouseId { get; set; }

        public string Category { get; set; } = string.Empty;
        public string SubCategory { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public string Colour { get; set; } = string.Empty;
        public string ItemType { get; set; } = string.Empty; // e.g., Long Sleeve, Short Sleeve
        public string ProductPhotoUrl { get; set; } = string.Empty;
         
        public Guid? LocationId { get; set; } // Nullable if not all products have a location assigned

        public Location? Location { get; set; }

        // Navigation Property
        public ICollection<ProductUom> ProductUoms { get; set; }
    }
}

