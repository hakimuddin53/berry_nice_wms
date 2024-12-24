using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class Location
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Name { get; set; } // e.g., Bin A, Rack 1

        // Navigation Property
        public ICollection<Product>? Products { get; set; }

    }
}
