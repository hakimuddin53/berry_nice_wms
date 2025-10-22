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
        [Column(TypeName = "nvarchar(max)")]
        public string Remark { get; set; } = string.Empty;

        [ForeignKey(nameof(StockInItemId))]
        public StockInItem? StockInItem { get; set; }
    }
}
