using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public class StockOutItem : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StockOutId { get; set; }

        [Required]
        public Guid ProductId { get; set; }                      

        [Required]
        public int Quantity { get; set; } 

    }
}
