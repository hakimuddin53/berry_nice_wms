using Wms.Api.Entities;

namespace Wms.Api.Services
{
    public interface ITokenService
    {
        Task<string> GenerateJwtTokenAsync(ApplicationUser? user);
    }
}
