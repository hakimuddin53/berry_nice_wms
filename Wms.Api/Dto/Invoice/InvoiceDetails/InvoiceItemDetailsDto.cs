namespace Wms.Api.Dto.Invoice.InvoiceDetails
{
    public class InvoiceItemDetailsDto
    {
        public Guid Id { get; set; }
        public Guid InvoiceId { get; set; }
        public Guid? ProductId { get; set; }
        public string? ProductCode { get; set; }
        public string? Description { get; set; }
        public string? PrimarySerialNumber { get; set; }
        public string? ManufactureSerialNumber { get; set; }
        public string? Imei { get; set; }
        public int WarrantyDurationMonths { get; set; }
        public string? UnitOfMeasure { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Status { get; set; }
    }
}
