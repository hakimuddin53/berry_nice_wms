using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public class ProductUom : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public Guid UomId { get; set; }

    }
}
