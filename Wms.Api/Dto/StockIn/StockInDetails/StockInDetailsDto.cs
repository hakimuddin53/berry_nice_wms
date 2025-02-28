namespace Wms.Api.Dto.StockIn.StockInCreateUpdate
{
    public class StockInDetailsDto
    {
        public Guid Id { get; set; }
        public required string Number { get; set; }
        public required string PONumber { get; set; }
        public Guid WarehouseId { get; set; }
        public Guid LocationId { get; set; }
        public string Warehouse { get; set; }
        public string Location { get; set; }

        public DateTime CreatedAt { get; set; }
        public required string CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public string? ChangedById { get; set; }

        public ICollection<StockInItemDetailsDto>? StockInItems { get; set; }
    }
}
