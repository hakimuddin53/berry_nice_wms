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
        [Required]
        public Guid ProductId { get; set; }

        [Range(0, int.MaxValue)]
        public int CountedQuantity { get; set; }

        public string? Remark { get; set; }
    }
}
