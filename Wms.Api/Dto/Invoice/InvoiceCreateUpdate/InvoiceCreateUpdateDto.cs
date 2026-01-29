using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.Invoice.InvoiceCreateUpdate
{
    public class InvoiceCreateUpdateDto
    {
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

        [Required]
        public Guid WarehouseId { get; set; }

        [Required]
        public ICollection<InvoiceItemCreateUpdateDto> InvoiceItems { get; set; } = new List<InvoiceItemCreateUpdateDto>();
    }
}
