using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.Invoice.InvoiceCreateUpdate
{
    public class InvoiceItemCreateUpdateDto
    {
        public Guid? Id { get; set; }

        public Guid? ProductId { get; set; }

        public decimal WarrantyDurationMonths { get; set; }

        public int Quantity { get; set; }

        [Range(0, double.MaxValue)]
        public decimal UnitPrice { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TotalPrice { get; set; }

        [MaxLength(512)]
        public string? Remark { get; set; }
    }
}
