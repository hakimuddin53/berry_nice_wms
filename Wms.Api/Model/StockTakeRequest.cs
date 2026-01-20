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
        public Guid? ProductId { get; set; }

        public string? ScannedBarcode { get; set; }

        public int CountedQuantity { get; set; }

        public string? Remark { get; set; }
    }
}
