using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class Design : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public required string Name { get; set; }  
    }
}
