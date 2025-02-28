using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class StockOut : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Number { get; set; }

        [Required]
        public required string DONumber { get; set; }

        // Navigation Property
        public ICollection<StockOutItem>? StockOutItems { get; set; }
    }
}
