using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.Supplier.SupplierDetails
{
    public class SupplierDetailsDto
    {
        public Guid Id { get; set; }
        public string SupplierCode { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? IC { get; set; }
        public string? TaxId { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? Address3 { get; set; }
        public string? Address4 { get; set; }
        public string? ContactNo { get; set; }
        public string? Email { get; set; }

        public DateTime CreatedAt { get; set; }
        public Guid CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public Guid? ChangedById { get; set; }
    }

    public class SupplierFindByParametersDto : PagedRequestAbstractDto
    {
        public Guid[] SupplierIds { get; set; } = [];
    }
}