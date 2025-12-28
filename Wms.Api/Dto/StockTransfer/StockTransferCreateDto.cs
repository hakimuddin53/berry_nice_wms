using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.StockTransfer
{
    public class StockTransferCreateDto
    {
        [Required]
        public Guid FromWarehouseId { get; set; }

        [Required]
        public Guid ToWarehouseId { get; set; }

        [Required]
        [MinLength(1)]
        public List<StockTransferCreateItemDto> Items { get; set; } = new();
    }

    public class StockTransferCreateItemDto
    {
        [Required]
        public Guid ProductId { get; set; }

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; } = 1;

        public string? Remark { get; set; }
    }
}
