using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class Uom
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;
    }
}
