using Wms.Api.Dto.StockOut.StockOutCreateUpdate;

namespace Wms.Api.Dto.StockOut.StockOutCreateUpdateDto
{
    public class StockOutCreateUpdateDto 
    { 
        public required string Number { get; set; }
        public required string DONumber { get; set; }
        public required string ToLocation { get; set; }
        public Guid WarehouseId { get; set; }
        public ICollection<StockOutItemCreateUpdateDto>? StockOutItems { get; set; }
    }
}
