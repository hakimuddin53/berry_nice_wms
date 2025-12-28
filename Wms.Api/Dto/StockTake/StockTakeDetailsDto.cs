namespace Wms.Api.Dto.StockTake
{
    public class StockTakeDetailsDto
    {
        public Guid Id { get; set; }
        public string Number { get; set; } = default!;
        public Guid WarehouseId { get; set; }
        public string? WarehouseName { get; set; }
        public DateTime TakenAt { get; set; }
        public string? Remark { get; set; }
        public List<StockTakeItemDetailsDto> Items { get; set; } = new();
    }

    public class StockTakeItemDetailsDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string? ProductCode { get; set; }
        public int CountedQuantity { get; set; }
        public int SystemQuantity { get; set; }
        public int DifferenceQuantity { get; set; }
        public string? Remark { get; set; }
    }
}
