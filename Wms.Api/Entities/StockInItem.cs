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
        public required string StockInItemNumber { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public Guid ProductUomId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,5)")]
        public decimal ListPrice { get; set; }
    }
}
