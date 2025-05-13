namespace Wms.Api.Dto.StockAdjustment.StockAdjustmentSearch
{
    public class StockAdjustmentSearchDto : PagedRequestAbstractDto
    { 
        public required string search { get; set; }       
    }
}
