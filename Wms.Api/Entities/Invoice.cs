using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class Invoice : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(64)]
        public string Number { get; set; } = default!;

        public Guid? CustomerId { get; set; }

        [MaxLength(256)]
        public string? CustomerName { get; set; }

        [Required]
        public DateTime DateOfSale { get; set; }

        [Required]
        [MaxLength(450)]
        public string SalesPersonId { get; set; } = default!;

        [MaxLength(128)]
        public string? EOrderNumber { get; set; }

        public Guid? SalesTypeId { get; set; }

        public Guid? PaymentTypeId { get; set; }

        [MaxLength(128)]
        public string? PaymentReference { get; set; }

        [MaxLength(512)]
        public string? Remark { get; set; }

        [System.ComponentModel.DataAnnotations.Schema.Column(TypeName = "decimal(18,4)")]
        public decimal GrandTotal { get; set; }

        public Guid? WarehouseId { get; set; } // Warehouse for inventory movements

        public ICollection<InvoiceItem>? InvoiceItems { get; set; }
    }
}
