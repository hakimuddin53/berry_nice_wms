using System;
using System.Collections.Generic;
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
        public Guid LocationId { get; set; }

        [Required]
        public int ReceiveQuantity { get; set; }

        [ForeignKey(nameof(StockInId))]
        public StockIn? StockIn { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }

        // Comma-delimited free-text remarks (chips in UI)
        public string? Remark { get; set; }

        // Additional internal note stored verbatim
        public string? InternalRemark { get; set; }
    }
}
