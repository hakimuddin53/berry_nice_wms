using Wms.Api.Entities;
using Wms.Api.Model;

namespace Wms.Api.Services
{
    public interface ICurrentUserService
    {
        string UserId();
        string UserEmailOrId();
    }
}
