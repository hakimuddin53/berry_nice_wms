namespace Wms.Api.Dto.StockIn.StockInCreateUpdate
{
    public class StockInDetailsDto
    {
        public Guid Id { get; set; }
        public required string Number { get; set; }      
        public Guid WarehouseId { get; set; } 
        public ICollection<StockInItemDetailsDto>? StockInItemDetailsDto { get; set; }
    }
}
