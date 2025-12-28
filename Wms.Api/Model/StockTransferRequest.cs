using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Model
{
    public sealed class StockTransferRequest
    {
        public string? Number { get; set; }

        [Required]
        public Guid FromWarehouseId { get; set; }

        [Required]
        public Guid ToWarehouseId { get; set; }

        [Required]
        public List<StockTransferItem> Items { get; set; } = new();
    }

    public sealed class StockTransferItem
    {
        [Required]
        public Guid ProductId { get; set; }

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        public string? Remark { get; set; }
    }
}
