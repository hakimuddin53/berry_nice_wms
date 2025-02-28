using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class Size : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Name { get; set; }  
    }
}
