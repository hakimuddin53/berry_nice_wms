using System.ComponentModel.DataAnnotations;
using Wms.Api.Entities; 

namespace Wms.Api.Dto.Usere
{
    public class UserDetailsDto : CreatedChangedEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public Guid UserRoleId { get; set; }
        public string UserRoleName { get; set; }
    }

    public class UserCreateUpdateDto
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public Guid UserRoleId { get; set; }
    }

    public class UserSearchDto : PagedRequestAbstractDto
    {
        public required string Search { get; set; }
    }

    public class UserFindByParametersDto : PagedRequestAbstractDto
    {
        [Required, MinLength(1)]
        public Guid[] UserIds { get; set; }
    }
}
