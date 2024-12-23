using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class StockOut
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string RunningDocumentNumber { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public required string Warehouse { get; set; }

        // Navigation Property
        public ICollection<StockOutDetail>? StockOutDetails { get; set; }
    }
}
