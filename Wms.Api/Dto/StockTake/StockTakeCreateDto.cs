using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.StockTake
{
    public class StockTakeCreateDto
    {
        [Required]
        public Guid WarehouseId { get; set; }

        public string? Remark { get; set; }

        [Required]
        [MinLength(1)]
        public List<StockTakeCreateItemDto> Items { get; set; } = new();
    }

    public class StockTakeCreateItemDto
    {
        public Guid? ProductId { get; set; }

        public string? ScannedBarcode { get; set; }

        [Range(1, int.MaxValue)]
        public int CountedQuantity { get; set; }

        public string? Remark { get; set; }
    }
}
