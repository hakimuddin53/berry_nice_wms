namespace Wms.Api.Dto.StockTake
{
    public class StockTakeSearchDto
    {
        public string? Search { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
