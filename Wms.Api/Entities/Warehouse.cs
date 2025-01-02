using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class Warehouse : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Name { get; set; }  
    }
}
