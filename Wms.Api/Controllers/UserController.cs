using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList; 
using Wms.Api.Entities;
using Wms.Api.Services; 
using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Wms.Api.Dto.Usere;
using System;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Wms.Api.Dto.UserRole;
using DocumentFormat.OpenXml.InkML;
using System.Security.Claims;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserController : ControllerBase
    {
        private readonly IService<ApplicationUser> _service;
        private readonly IMapper _autoMapperService;
        protected readonly UserManager<ApplicationUser> _userManager;
        protected readonly RoleManager<ApplicationRole> _roleManager;

        public UserController(IService<ApplicationUser> service, IMapper autoMapperService, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            _service = service;
            _autoMapperService = autoMapperService;
            _userManager = userManager;
            _roleManager = roleManager;
        }


        [HttpGet("select-options")]
        [ProducesResponseType(typeof(PagedListDto<SelectOptionV12Dto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSelectOptionsAsync([FromQuery] GlobalSelectFilterV12Dto selectFilterV12Dto)
        {
            var predicate = PredicateBuilder.New<ApplicationUser>(true);

            if (selectFilterV12Dto.Ids != null)
            {
                predicate = predicate.And(user => selectFilterV12Dto.Ids.Contains(Guid.Parse(user.Id)));
            }

            if (selectFilterV12Dto.SearchString != null)
            {
                predicate = predicate.And(user =>
                    user.Name.Contains(selectFilterV12Dto.SearchString));
            }

            // Use the reusable pagination method
            var paginatedResult = await _service.GetPaginatedAsync(predicate, new Paginator
            {
                Page = selectFilterV12Dto.Page,
                PageSize = selectFilterV12Dto.PageSize,
            });

            var resultToList = await paginatedResult.ToListAsync();

            PagedList<ApplicationUser> pagedResult = new PagedList<ApplicationUser>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var userDtos = _autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(userDtos);
        }

        [HttpPost("search", Name = "SearchUsersAsync")]
        public async Task<IActionResult> SearchUsersAsync([FromBody] UserSearchDto userSearch)
        {
            // Get the current user's email 

            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";

            // If admin, return empty results
            if (userEmail.Equals("admin@mhglobal.com", StringComparison.OrdinalIgnoreCase))
            {
                PagedList<UserDetailsDto> emptyPagedList = new PagedList<UserDetailsDto>(new List<UserDetailsDto>(), userSearch.Page, userSearch.PageSize);
                return Ok(emptyPagedList);
            }

            var users = await _service.GetAllAsync(e => e.Name.Contains(userSearch.Search));

            var result = users.Skip((userSearch.Page - 1) * userSearch.PageSize).Take(userSearch.PageSize).ToList();
            PagedList<ApplicationUser> pagedResult = new PagedList<ApplicationUser>(result, userSearch.Page, userSearch.PageSize);

            var userDtos = _autoMapperService.Map<PagedListDto<UserDetailsDto>>(pagedResult);

            foreach (var user in userDtos.Data)
            {
                var role = await _roleManager.FindByIdAsync(user.UserRoleId.ToString());
                user.UserRoleName = role?.Name ?? "";                
            }

            return Ok(userDtos);  
        }

        [HttpPost("count", Name = "CountUsersAsync")]
        public async Task<IActionResult> CountUsersAsync([FromBody] UserSearchDto userSearch)
        {
            // Get the current user's email
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";

            // If admin, return count = 0
            if (userEmail.Equals("admin@mhglobal.com", StringComparison.OrdinalIgnoreCase))
            {
                return Ok(0);
            }

            var users = await _service.GetAllAsync(e => e.Name.Contains(userSearch.Search));

            var userDtos = _autoMapperService.Map<List<UserDetailsDto>>(users);
            return Ok(userDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return NotFound();

            var userDtos = _autoMapperService.Map<UserDetailsDto>(user);  
            var role = await _roleManager.FindByIdAsync(userDtos.UserRoleId.ToString());
            userDtos.UserRoleName = role?.Name ?? "";
            return Ok(userDtos); 
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserCreateUpdateDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new ApplicationUser { UserName = model.Email, Email = model.Email, Name = model.Name , UserRoleId = model.UserRoleId };
             
            var result = await _userManager.CreateAsync(user, model.Password);

            // Check if the user creation failed
            if (!result.Succeeded)
            { 
                var errorDescriptions = string.Join("; ", result.Errors.Select(e => e.Description)); 
                throw new Exception($"Failed to create user '{model.Email}'. Errors: {errorDescriptions}"); 
            }

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ApplicationUser model)
        {
            if (!ModelState.IsValid || id != Guid.Parse(model.Id))
                return BadRequest();
              
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound($"User with ID '{id}' not found.");
            }
             
            user.UserRoleId = model.UserRoleId;
             
            var result = await _userManager.UpdateAsync(user);

            // 4. Check if the update operation succeeded
            if (!result.Succeeded)
            { 
                var errorDescriptions = string.Join("; ", result.Errors.Select(e => e.Description)); 
                return BadRequest($"Failed to update user role. Errors: {errorDescriptions}"); // Or a generic message
            }
             
            return NoContent();

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
