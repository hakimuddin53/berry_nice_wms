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

        public int WarrantyDurationMonths { get; set; }

        public DateTime? WarrantyExpiryDate { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal UnitPrice { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal TotalPrice { get; set; }

        [ForeignKey(nameof(InvoiceId))]
        public Invoice? Invoice { get; set; }
    }
}
