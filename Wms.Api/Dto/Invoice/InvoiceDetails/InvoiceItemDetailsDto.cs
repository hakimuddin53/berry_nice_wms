namespace Wms.Api.Dto.Invoice.InvoiceDetails
{
    public class InvoiceItemDetailsDto
    {
        public Guid Id { get; set; }
        public Guid InvoiceId { get; set; }
        public Guid? ProductId { get; set; }
        public string? ProductCode { get; set; }
        public string? ProductName { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public Guid? LocationId { get; set; }
        public string? LocationName { get; set; }
        public string? LocationLabel { get; set; }
        public int WarrantyDurationMonths { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime? WarrantyExpiryDate { get; set; }
    }
}
