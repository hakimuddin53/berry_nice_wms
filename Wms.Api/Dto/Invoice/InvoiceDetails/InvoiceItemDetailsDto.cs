namespace Wms.Api.Dto.Invoice.InvoiceDetails
{
    public class InvoiceItemDetailsDto
    {
        public Guid Id { get; set; }
        public Guid InvoiceId { get; set; }
        public Guid? ProductId { get; set; }
        public int WarrantyDurationMonths { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime? WarrantyExpiryDate { get; set; }
    }
}
