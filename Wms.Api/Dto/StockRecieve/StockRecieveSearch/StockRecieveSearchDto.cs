namespace Wms.Api.Dto.StockRecieve.StockRecieveSearch
{
    public class StockRecieveSearchDto : PagedRequestAbstractDto
    {  
        public required string search { get; set; }       
    }
}

