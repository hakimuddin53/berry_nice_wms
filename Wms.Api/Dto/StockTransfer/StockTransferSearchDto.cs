namespace Wms.Api.Dto.StockTransfer
{
    public class StockTransferSearchDto
    {
        public string? Search { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
