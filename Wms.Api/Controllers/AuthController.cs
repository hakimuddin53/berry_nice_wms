using Microsoft.AspNetCore.Mvc;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController] 
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;

        public AuthController(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpPost("sign-in")]
        public IActionResult Login([FromBody] LoginModel model)
        { 
            if (model.Username == "hakimuddin752@gmail.com" && model.Password == "1")
            {
                var token = _tokenService.GenerateJwtToken(model.Username);
                return Ok(new { token });
            }
            return Unauthorized();
        } 
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    } 
}




