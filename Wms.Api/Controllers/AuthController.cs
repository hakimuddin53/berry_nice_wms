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

        [HttpPost("GeneratePassword")]
        public async Task<IActionResult> GeneratePassword()
        {
            // List of users with their raw passwords
            var entries = new List<(string Name, string RawPassword)>
        {
            ("Aziana Binti Talib", "830219016350"),
            ("Fatin Hamiza Binti Abd Hamid", "960425145706"),
            ("Mohd Hasman Bin Ab Rahman", "820626105861"),
            ("Nor Solehah Binti Mohammad Salleh", "941006086330"),
            ("Mohd Arshad Bin Abu Talib", "870820146013"),
            ("Cynthia Ng Siew Ting", "870606495407"),
            ("Aileen O. Peraltha", "P5642894B"),
            ("Pang Min Yuan", "960122016392"),
            ("Raven Kissel Bulan", "raven12345"),
            ("DG Siti Hafizah Binti Zaidi", "971022125982"),
            ("Jogie Rebucas Momprio", "P8651244B"),
            ("Misliyati Binti Elas", "711111085256"),
            ("Toh Chin Wei", "940126055147"),
            ("Lai Wen Qian", "1103141354"),
            ("Nur Batrisyia Ilhami", "40402080020"),
            ("Liew Xin Yi", "940729055488"),
            ("Fairry Gil Elle", "P6030306A"),
            ("Mary Lovely C. Templa", "P9961049A"),
            ("Nur Shahira Binti Mohd Rosnan", "950111106334"),
            ("Choong Li Khee (Carene)", "50325146200"),
            ("Tengku Sarah Amalina", "931201115708"),
            ("Zarifah Binti Zohainan", "971105136310"),
            ("Ryna Bulan Dela Cruz", "P9083935A"),
            ("Nur Atasha Alina", "991015066222"),
            ("Chandra Kirana", "X1328752"),
            ("Intan Sabrina Hanapi", "20922011004"),
            ("Nursyarina Atika Binti Ahmad", "1101102458"),
            ("Muhammad Hisyam Bin Che Aziz", "980529035817"),
            ("Adeleen Andrina Robeiro", "921014086324"),
            ("Yap Li Teng (Ivy)", "821018086040"),
            ("Rohaizura Binti A Rahim", "901123016116"),
            ("Nurul Aqilah Binti Mohd Idrus", "10727140186"),
            ("Haresh Singh", "718131107"),
            ("Naqib", "124040283"),
            ("Andrew Solomon", "770802105703"),
            ("Sharmiza", "900320145182"),
            ("Edmund Chong", "edmund123")
        };

            var hasher = new PasswordHasher<IdentityUser>();

            foreach (var (name, raw) in entries)
            {
                // Prefix numeric-only passwords with "Mh"
                var password = $"Mh{raw}";
                var hash = hasher.HashPassword(null, password);

                Console.WriteLine($"Name: {name}");
                Console.WriteLine($"Password: {password}");
                Console.WriteLine($"Hash: {hash}");
                Console.WriteLine(new string('-', 40));
            }

            return Ok();
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

            if (result.Succeeded)
            {
                var user = await _userManager.FindByNameAsync(model.Email);
                var jwt = await _tokenService.GenerateJwtTokenAsync(user!);
                return Ok(new { jwt });
            }

            return Unauthorized("Invalid login attempt.");
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




