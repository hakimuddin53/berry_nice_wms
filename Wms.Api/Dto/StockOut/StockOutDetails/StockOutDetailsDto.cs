using Wms.Api.Dto.StockOut.StockOutDetails;

namespace Wms.Api.Dto.StockOut.StockOutCreateUpdate
{
    public class StockOutDetailsDto
    {
        public Guid Id { get; set; }
        public required string Number { get; set; }
        public required string DONumber { get; set; }
        public required string SONumber { get; set; }
        public required string ToLocation { get; set; }
        public Guid WarehouseId { get; set; } 
        public string Warehouse { get; set; } 
        public DateTime CreatedAt { get; set; }
        public required string CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public string? ChangedById { get; set; }
        public ICollection<StockOutItemDetailsDto>? StockOutItems { get; set; }
    }
}
