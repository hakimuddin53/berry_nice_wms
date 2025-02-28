namespace Wms.Api.Dto.StockIn.StockInSearch
{
    public class StockInSearchDto : PagedRequestAbstractDto
    {  
        public required string search { get; set; }       
    }
}
