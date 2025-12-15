using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public class StockRecieveItem : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StockRecieveId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public int ReceiveQuantity { get; set; }

        [ForeignKey(nameof(StockRecieveId))]
        public StockRecieve? StockRecieve { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }
    }
}
