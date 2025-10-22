namespace Wms.Api.Dto.Invoice.InvoiceSearch
{
    public class InvoiceSearchDto
    {
        public string? Search { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
