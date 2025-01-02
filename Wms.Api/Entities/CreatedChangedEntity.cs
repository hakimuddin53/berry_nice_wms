using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    public abstract class CreatedChangedEntity
    {
        [Required]
        [Display(Name = "Created at")]
        public DateTime CreatedAt { get; set; }
        [Required]
        [Display(Name = "Created by")]
        public Guid CreatedById { get; set; }
        [Display(Name = "Changed at")]
        public DateTime? ChangedAt { get; set; }
        [Display(Name = "Changed by")]
        public Guid? ChangedById { get; set; }
    }
}
