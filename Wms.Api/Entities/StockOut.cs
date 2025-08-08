using System.ComponentModel.DataAnnotations;
using Wms.Api.Model;

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

        [Required]
        public required string SONumber { get; set; }

        [Required]
        public required string ToLocation { get; set; }

        [Required]
        public StockOutStatusEnum Status { get; set; }

        [Required]
        public Guid WarehouseId { get; set; }

        // Navigation Property
        public ICollection<StockOutItem>? StockOutItems { get; set; } 

    }
}


