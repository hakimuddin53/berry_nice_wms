using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Model
{
    public class StockTakeRequest
    {
        [Required]
        public Guid WarehouseId { get; set; }

        [Required]
        public List<StockTakeItemRequest> Items { get; set; } = new();

        public string? Remark { get; set; }
    }

    public class StockTakeItemRequest
    {
        [Required]
        public Guid ProductId { get; set; }

        [Range(0, int.MaxValue)]
        public int CountedQuantity { get; set; }

        public string? Remark { get; set; }
    }
}
