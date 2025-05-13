using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 
using Wms.Api.Model;

namespace Wms.Api.Dto.Product.ProductDetails
{
    public class ProductDetailsDto
    {
        public Guid Id { get; set; }
        public required string SerialNumber { get; set; }
        public required string Name { get; set; }
        public required string ItemCode { get; set; }
        public string ClientCodeString { get; set; }
        public Guid ClientCodeId { get; set; }
        public int QuantityPerCarton { get; set; }
        public string Category { get; set; }
        public string Size { get; set; }
        public string Colour { get; set; }
        public string Design { get; set; } 

        // change to stock group
        public string CartonSize { get; set; } 
        public Guid CategoryId { get; set; }
        public Guid SizeId { get; set; }
        public Guid ColourId { get; set; }
        public Guid DesignId { get; set; }
        public Guid CartonSizeId { get; set; }
        public string? ProductPhotoUrl { get; set; }  // base 64 image
        [Column(TypeName = "decimal(18,5)")]
        public decimal ListPrice { get; set; }
        public int Threshold { get; set; }

        public DateTime CreatedAt { get; set; }
        public required string CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public string? ChangedById { get; set; }
    }
    
    public class ProductFindByParametersDto : PagedRequestAbstractDto
    {
        public Guid[] ProductIds { get; set; } = [];
    }
}
