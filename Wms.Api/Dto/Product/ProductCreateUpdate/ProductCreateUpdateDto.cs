using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 
using Wms.Api.Model;

namespace Wms.Api.Dto.Product.ProductCreateUpdate
{
    public class ProductCreateUpdateDto
    {   
        public required string Name { get; set; } 
        public required string ItemCode { get; set; } 
        public string ClientCode { get; set; } 
        public int QuantityPerCarton { get; set; }
        public Guid CategoryId { get; set; }
        public Guid SizeId { get; set; }
        public Guid ColourId { get; set; }
        public Guid DesignId { get; set; } 
        public Guid CartonSizeId { get; set; }
        public string? ProductPhotoUrl { get; set; }  // base 64 image
        [Column(TypeName = "decimal(18,5)")]
        public decimal ListPrice { get; set; }
        public int Threshold { get; set; }
    }  
}
