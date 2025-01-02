using Wms.Api.Dto.StockOut.StockOutDetails;

namespace Wms.Api.Dto.StockOut.StockOutCreateUpdate
{
    public class StockOutDetailsDto
    {
        public Guid Id { get; set; }
        public required string Number { get; set; }      
        public Guid WarehouseId { get; set; } 
        public ICollection<StockOutItemDetailsDto>? StockOutItemDetailsDto { get; set; }
    }
}
