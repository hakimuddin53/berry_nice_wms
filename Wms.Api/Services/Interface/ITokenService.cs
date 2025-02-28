using Wms.Api.Entities;

namespace Wms.Api.Services
{
    public interface ITokenService
    {
        string GenerateJwtToken(ApplicationUser? user);
    }
}
