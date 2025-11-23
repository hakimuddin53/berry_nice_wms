using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public class StockInItemRemark : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StockInItemId { get; set; }

        [Required]
        public Guid ProductRemarkId { get; set; }

        [ForeignKey(nameof(StockInItemId))]
        public StockInItem? StockInItem { get; set; }

        [ForeignKey(nameof(ProductRemarkId))]
        public ProductRemark? ProductRemark { get; set; }
    }
}
