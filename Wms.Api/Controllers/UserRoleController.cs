using AutoMapper;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore; 
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList; 
using Wms.Api.Dto.Usere;
using Wms.Api.Dto.UserRole;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services; 

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/user-role")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserRoleController : ControllerBase
    {
        private readonly IService<ApplicationRole> _service;
        private readonly IMapper _autoMapperService;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly ApplicationDbContext _context;

        public UserRoleController(IService<ApplicationRole> service, IMapper autoMapperService, RoleManager<ApplicationRole> roleManager, ApplicationDbContext context)
        {
            _service = service;
            _autoMapperService = autoMapperService;
            _roleManager = roleManager;
            _context = context;
        }

        [HttpGet("select-options")]
        [ProducesResponseType(typeof(PagedListDto<SelectOptionV12Dto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSelectOptionsAsync([FromQuery] GlobalSelectFilterV12Dto selectFilterV12Dto)
        {
            // Start with the base query
            var roleQuery = _roleManager.Roles.ToList();

            // Apply filters conditionally
            if (selectFilterV12Dto.Ids != null)
            {
                var parsedIds = selectFilterV12Dto.Ids.Select(id => Guid.Parse(id.ToString())).ToList();
                roleQuery = [.. roleQuery.Where(role => parsedIds.Contains(Guid.Parse(role.Id)))];
            }

            if (!string.IsNullOrWhiteSpace(selectFilterV12Dto.SearchString))
            {
                roleQuery = [.. roleQuery.Where(role => role.DisplayName.Contains(selectFilterV12Dto.SearchString))];
            }

            // Apply pagination
            var paginatedResult = roleQuery
                .Skip((selectFilterV12Dto.Page - 1) * selectFilterV12Dto.PageSize)
                .Take(selectFilterV12Dto.PageSize)
                .ToList();

            PagedList<ApplicationRole> pagedResult = new PagedList<ApplicationRole>(paginatedResult, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            // Map to DTO
            var userRoleDtos = _autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(userRoleDtos);
        }

        [HttpPost("search", Name = "SearchUserRolesAsync")]
        public async Task<IActionResult> SearchUserRolesAsync([FromBody] UserRoleSearchDto userRoleSearch)
        {
            var userRoles = await _service.GetAllAsync(e => e.DisplayName.Contains(userRoleSearch.Search));

            var result = userRoles.Skip((userRoleSearch.Page - 1) * userRoleSearch.PageSize).Take(userRoleSearch.PageSize).ToList();
            PagedList<ApplicationRole> pagedResult = new PagedList<ApplicationRole>(result, userRoleSearch.Page, userRoleSearch.PageSize);

            var userRoleDtos = _autoMapperService.Map<PagedListDto<UserRoleDetailsDto>>(pagedResult);

            return Ok(userRoleDtos);
        }         

        [HttpPost("count", Name = "CountUserRolesAsync")]
        public async Task<IActionResult> CountUserRolesAsync([FromBody] UserRoleSearchDto userRoleSearch)
        {
            var userRoles = await _service.GetAllAsync(e => e.DisplayName.Contains(userRoleSearch.Search));

            var userRoleDtos = _autoMapperService.Map<List<UserRoleDetailsDto>>(userRoles);
            return Ok(userRoleDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _roleManager.FindByIdAsync(id.ToString());
            if (user == null)
                return NotFound();
            var userRoleDtos = _autoMapperService.Map<UserRoleDetailsDto>(user);

            return Ok(userRoleDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ApplicationRole newRole)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _roleManager.CreateAsync(newRole);
            return CreatedAtAction(nameof(GetById), new { id = newRole.Id }, newRole);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ApplicationRole user)
        {
            if (!ModelState.IsValid || id != Guid.Parse(user.Id))
                return BadRequest();

            await _service.UpdateAsync(user);
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
