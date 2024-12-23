using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class CustomerReturn
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        public string? ReasonForReturn { get; set; }

        [Required]
        public required string WarehouseType { get; set; } // Normal, Rejected
        
    }
}
