using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.Invoice.InvoiceCreateUpdate
{
    public class InvoiceItemCreateUpdateDto
    {
        public Guid? Id { get; set; }

        public Guid? ProductId { get; set; }

        public int WarrantyDurationMonths { get; set; }

        public int Quantity { get; set; }

        [Range(0, double.MaxValue)]
        public decimal UnitPrice { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TotalPrice { get; set; }
    }
}
