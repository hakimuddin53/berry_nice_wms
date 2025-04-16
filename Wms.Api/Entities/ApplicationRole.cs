using Microsoft.AspNetCore.Identity;
using Wms.Api.Model;

namespace Wms.Api.Entities
{
    public class ApplicationRole : IdentityRole
    { 
        public required string DisplayName { get; set; }
        public required string Module { get; set; }
        public required string CartonSizeId { get; set; }
    }
}
