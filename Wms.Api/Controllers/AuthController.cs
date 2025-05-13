using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Wms.Api.Entities;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController] 
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService; 
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthController(ITokenService tokenService, 
                            UserManager<ApplicationUser> userManager,
                          SignInManager<ApplicationUser> signInManager)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _signInManager = signInManager;
        }
 

        // POST: api/Auth/Register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        { 
            var user = new ApplicationUser { UserName = model.Email, Email = model.Email , Name = model.Name };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
                return Ok("User registered successfully.");

            foreach (var error in result.Errors)
                ModelState.AddModelError(string.Empty, error.Description);

            return BadRequest(ModelState);
        }

        // POST: api/Auth/Login
        [HttpPost("sign-in")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: false, lockoutOnFailure: false);

            //if (result.Succeeded)
            //{
                var user = await _userManager.FindByNameAsync(model.Email);
                var jwt = await _tokenService.GenerateJwtTokenAsync(user!);
                return Ok(new { jwt });
            //}

            //return Unauthorized("Invalid login attempt.");
        }
    }

    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class RegisterDto
    {
        [Required] 
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; }
    }
}




