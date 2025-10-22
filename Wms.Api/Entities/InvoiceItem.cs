using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public class InvoiceItem : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid InvoiceId { get; set; }

        public Guid? ProductId { get; set; }

        [MaxLength(64)]
        public string? ProductCode { get; set; }

        [MaxLength(256)]
        public string? Description { get; set; }

        [MaxLength(128)]
        public string? PrimarySerialNumber { get; set; }

        [MaxLength(128)]
        public string? ManufactureSerialNumber { get; set; }

        [MaxLength(128)]
        public string? Imei { get; set; }

        public int WarrantyDurationMonths { get; set; }

        [MaxLength(32)]
        public string? UnitOfMeasure { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal UnitPrice { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal TotalPrice { get; set; }

        [MaxLength(64)]
        public string? Status { get; set; }

        [ForeignKey(nameof(InvoiceId))]
        public Invoice? Invoice { get; set; }
    }
}
