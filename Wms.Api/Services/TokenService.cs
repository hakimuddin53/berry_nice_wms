using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Wms.Api.Entities;
using static Wms.Api.Model.Constants;

namespace Wms.Api.Services
{
    public class TokenService(RoleManager<ApplicationRole> roleManager) : ITokenService
    {
        protected readonly RoleManager<ApplicationRole> _roleManager = roleManager;

        public async Task<string> GenerateJwtTokenAsync(ApplicationUser? user)
        {
            var modules = "";
            if (user != null)
            {
                var userRole = await _roleManager.FindByIdAsync(user.UserRoleId.ToString());
                if (userRole != null)
                {
                    modules = userRole.Module;
                }
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TokenConstant.SecretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user?.Email ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user?.Id.ToString() ?? ""),
                new Claim(ClaimTypes.Email,user?.Email ?? ""),
                new Claim("Modules", modules),
            };

            var token = new JwtSecurityToken(
                issuer: TokenConstant.Issuer,
                audience: TokenConstant.Audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
