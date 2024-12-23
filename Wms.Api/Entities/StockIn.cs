using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class StockIn
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string RunningDocumentNumber { get; set; } 

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Warehouse { get; set; } = string.Empty;

        // Navigation Property
        public ICollection<StockInDetail>? StockInDetails { get; set; }
    }
}
