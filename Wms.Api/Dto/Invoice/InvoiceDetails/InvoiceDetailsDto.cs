using System.Collections.Generic;

namespace Wms.Api.Dto.Invoice.InvoiceDetails
{
    public class InvoiceDetailsDto
    {
        public Guid Id { get; set; }
        public string Number { get; set; } = default!;
        public Guid? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public DateTime DateOfSale { get; set; }
        public string SalesPersonId { get; set; } = default!;
        public string? SalesPersonName { get; set; }
        public string? EOrderNumber { get; set; }
        public Guid? SalesTypeId { get; set; }
        public string? SalesTypeName { get; set; }
        public Guid? PaymentTypeId { get; set; }
        public string? PaymentTypeName { get; set; }
        public string? PaymentReference { get; set; }
        public string? Remark { get; set; }
        public decimal GrandTotal { get; set; }

        public ICollection<InvoiceItemDetailsDto> InvoiceItems { get; set; } = new List<InvoiceItemDetailsDto>();
    }
}
