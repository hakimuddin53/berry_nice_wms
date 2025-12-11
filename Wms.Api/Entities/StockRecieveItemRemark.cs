using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public class StockRecieveItemRemark : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StockRecieveItemId { get; set; }

        [Required]
        public Guid ProductRemarkId { get; set; }

        [ForeignKey(nameof(StockRecieveItemId))]
        public StockRecieveItem? StockRecieveItem { get; set; }

        [ForeignKey(nameof(ProductRemarkId))]
        public ProductRemark? ProductRemark { get; set; }
    }
}

