namespace Wms.Api.Dto.StockReservation.StockReservationSearch
{
    public class StockReservationSearchDto : PagedRequestAbstractDto
    {  
        public required string search { get; set; }       
    }
}
