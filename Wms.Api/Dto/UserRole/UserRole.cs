using System;
using Wms.Api.Entities;
using Wms.Api.Model;

namespace Wms.Api.Dto.UserRole
{
    public class UserRoleDetailsDto 
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string DisplayName { get; set; }
        public ICollection<ModuleEnum> Module { get; set; }
    }

    public class UserRoleCreateUpdateDto
    {
        public required string Name { get; set; }
    }

    public class UserRoleSearchDto : PagedRequestAbstractDto
    {
        public required string Search { get; set; }
    }
}
