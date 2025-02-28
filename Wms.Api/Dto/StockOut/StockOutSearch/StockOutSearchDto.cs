namespace Wms.Api.Dto.StockOut.StockOutSearch
{
    public class StockOutSearchDto : PagedRequestAbstractDto
    { 
        public required string search { get; set; }       
    }
}
