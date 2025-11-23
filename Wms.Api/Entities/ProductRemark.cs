using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Entities
{
    public class ProductRemark : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string Remark { get; set; } = string.Empty;

        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }
    }
}
