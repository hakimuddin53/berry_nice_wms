 namespace Wms.Api.Services
{
    public interface ITokenService
    {
        string GenerateJwtToken(string userName);
    }
}
