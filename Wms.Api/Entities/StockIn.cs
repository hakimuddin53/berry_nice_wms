using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class StockIn : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Number { get; set; }

        [Required]
        public required string SellerInfo { get; set; }

        [Required]
        public required string Purchaser { get; set; }

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public DateTime DateOfPurchase { get; set; }

        [Required]
        public Guid WarehouseId { get; set; }

        public ICollection<StockInItem>? StockInItems { get; set; }
    }
}
