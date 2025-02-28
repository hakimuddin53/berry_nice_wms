namespace Wms.Api.Dto.StockTransfer.StockTransferSearch
{
    public class StockTransferSearchDto : PagedRequestAbstractDto
    { 
        public required string search { get; set; }       
    }
}
