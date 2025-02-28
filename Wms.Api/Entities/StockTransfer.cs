using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class StockTransfer : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Number { get; set; }

        public ICollection<StockTransferItem>? StockTransferItems { get; set; }
    }
}
