using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.Supplier.SupplierCreateUpdate
{
    public class SupplierCreateUpdateDto
    {
        [Required]
        public string SupplierCode { get; set; } = default!;
        [Required]
        public string Name { get; set; } = default!;
        public string? IC { get; set; }
        public string? TaxId { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? Address3 { get; set; }
        public string? Address4 { get; set; }
        public string? ContactNo { get; set; }
        public string? Email { get; set; }
    }
}