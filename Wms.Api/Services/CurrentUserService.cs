using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Wms.Api.Context;
using Wms.Api.Entities;
using Wms.Api.Model; 

namespace Wms.Api.Services
{
    public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        public string UserId()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            if (user == null || !user.Identity!.IsAuthenticated)
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }
            var claimsList = user.Claims.ToList();

            if (claimsList.Count > 2)
            {
                return claimsList[2].Value;
            }
            else
            {
                throw new IndexOutOfRangeException($"No claim found at index {2}.");
            }

        } 
    } 
}
