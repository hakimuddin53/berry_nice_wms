using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public class StockInItem : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StockInId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public int Quantity { get; set; } 
    }
}
