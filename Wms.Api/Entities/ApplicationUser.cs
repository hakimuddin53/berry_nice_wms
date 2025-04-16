using Microsoft.AspNetCore.Identity;

namespace Wms.Api.Entities
{
    public class ApplicationUser : IdentityUser
    {
  
        public required string Name { get; set; } 
        public Guid UserRoleId { get; set; }
    }
}
