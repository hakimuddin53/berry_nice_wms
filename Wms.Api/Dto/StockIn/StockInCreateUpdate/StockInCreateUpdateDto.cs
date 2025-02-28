namespace Wms.Api.Dto.StockIn.StockInCreateUpdate
{
    public class StockInCreateUpdateDto
    { 
        public required string Number { get; set; }
        public required string PONumber { get; set; }
        public Guid WarehouseId { get; set; }
        public Guid LocationId { get; set; }
        public ICollection<StockInItemCreateUpdateDto>? StockInItems { get; set; }
    }
}
