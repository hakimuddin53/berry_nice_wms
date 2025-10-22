using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.Invoice.InvoiceCreateUpdate
{
    public class InvoiceItemCreateUpdateDto
    {
        public Guid? Id { get; set; }

        public Guid? ProductId { get; set; }

        [MaxLength(64)]
        public string? ProductCode { get; set; }

        [MaxLength(256)]
        public string? Description { get; set; }

        [MaxLength(128)]
        public string? PrimarySerialNumber { get; set; }

        [MaxLength(128)]
        public string? ManufactureSerialNumber { get; set; }

        [MaxLength(128)]
        public string? Imei { get; set; }

        public int WarrantyDurationMonths { get; set; }

        [MaxLength(32)]
        public string? UnitOfMeasure { get; set; }

        public int Quantity { get; set; }

        [Range(0, double.MaxValue)]
        public decimal UnitPrice { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TotalPrice { get; set; }

        [MaxLength(64)]
        public string? Status { get; set; }
    }
}
