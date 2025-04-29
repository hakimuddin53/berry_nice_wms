using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList; 
using Wms.Api.Entities;
using Wms.Api.Services;
using Wms.Api.Dto.Inventory;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using System.ComponentModel;
using Wms.Api.Model;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Identity;
using System.Reflection;
using System.Security.Claims;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class InventoryController : ControllerBase
    {
        private readonly IService<Inventory> _service;
        private readonly IMapper _autoMapperService;
        private readonly ApplicationDbContext _context;

        protected readonly RoleManager<ApplicationRole> _roleManager;
        protected readonly UserManager<ApplicationUser> _userManager;

        public InventoryController(IService<Inventory> service, ApplicationDbContext context, IMapper autoMapperService, RoleManager<ApplicationRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _service = service;
            _autoMapperService = autoMapperService;
            _context = context;
            _roleManager = roleManager;
            _userManager = userManager;
        }
         

        [HttpPost("search", Name = "SearchInventorysAsync")]
        public async Task<IActionResult> SearchInventorysAsync([FromBody] InventorySearchDto inventorySearch)
        {
            var stockGroupId = "";

            var emailClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (emailClaim == null || string.IsNullOrEmpty(emailClaim.Value))
            {
                return BadRequest("User email is missing or invalid.");
            }

            var email = emailClaim.Value;
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("User not found.");
            } 

            // Check if the user is admin
            bool isAdmin = email.Equals("admin@mhglobal.com", StringComparison.OrdinalIgnoreCase);
         

            var userRole = await _roleManager.FindByIdAsync(user.UserRoleId.ToString());
            if (userRole != null)
            {
                stockGroupId = userRole.CartonSizeId;
            }

            // 1. Get the base filtered query
            var filteredQuery = GetFilteredInventoryQuery(inventorySearch, stockGroupId, isAdmin);

            // --- Apply sorting if needed ---
            filteredQuery = filteredQuery.OrderByDescending(i => i.CreatedAt); 


            var result = filteredQuery.Skip((inventorySearch.Page - 1) * inventorySearch.PageSize).Take(inventorySearch.PageSize).ToList();
            PagedList<Inventory> pagedResult = new PagedList<Inventory>(result, inventorySearch.Page, inventorySearch.PageSize);

            var inventoryDtos = _autoMapperService.Map<PagedListDto<InventoryDetailsDto>>(pagedResult);

            foreach (var inventory in inventoryDtos.Data)
            {
                var product = _context.Products?.Where(x => x.Id == inventory.ProductId)?.FirstOrDefault();
                inventory.Product = product?.Name ?? "";
                inventory.Warehouse = _context.Warehouses?.Where(x => x.Id == inventory.WarehouseId)?.FirstOrDefault()?.Name ?? "";
                inventory.CurrentLocation = _context.Locations?.Where(x => x.Id == inventory.CurrentLocationId)?.FirstOrDefault()?.Name ?? "";

                if (product != null)
                {
                    inventory.StockGroup = _context.CartonSizes?.Where(x => x.Id == product.CartonSizeId)?.FirstOrDefault()?.Name ?? "";
                    inventory.ClientCode = GetEnumDescription(product.ClientCode);
                }
            }

            return Ok(inventoryDtos);
        }

        [HttpPost("count", Name = "CountInventorysAsync")]
        public async Task<IActionResult> CountInventorysAsync([FromBody] InventorySearchDto inventorySearch)
        {
            var stockGroupId = "";

            var emailClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (emailClaim == null || string.IsNullOrEmpty(emailClaim.Value))
            {
                return BadRequest("User email is missing or invalid.");
            }

            var email = emailClaim.Value;
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            var userRole = await _roleManager.FindByIdAsync(user.UserRoleId.ToString());
            if (userRole != null)
            {
                stockGroupId = userRole.CartonSizeId;
            }

            var filteredQuery = GetFilteredInventoryQuery(inventorySearch, stockGroupId);

            var inventoryDtos = _autoMapperService.Map<List<InventoryDetailsDto>>(filteredQuery);
            return Ok(inventoryDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null)
                return NotFound();

            return Ok(product);
        }


        // Helper method to get the filtered inventory query
        private IQueryable<Inventory> GetFilteredInventoryQuery(InventorySearchDto inventorySearch, string? stockGroupIds, bool isAdmin = false)
        {
            // 1) Start with everything
            var query = _context.Inventories.AsQueryable();

            //if (isAdmin)
            //{
            //    // Admin sees all
            //    return query;
            //}

            // 2) Existing stock‐group / carton‐size filter
            if (!string.IsNullOrWhiteSpace(stockGroupIds))
            {
                var allowedCartonSizeIds = stockGroupIds
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .Select(id => Guid.TryParse(id, out var g) ? g : Guid.Empty)
                    .Where(g => g != Guid.Empty)
                    .ToList();

                if (allowedCartonSizeIds.Count != 0)
                {
                    query = query
                        .Join(_context.Products,
                              inv => inv.ProductId,
                              prod => prod.Id,
                              (inv, prod) => new { inv, prod })
                        .Where(x => allowedCartonSizeIds.Contains(x.prod.CartonSizeId))
                        .Select(x => x.inv);
                }
            }

            // 3) Filter by explicit ProductId list
            if (inventorySearch.ProductId?.Any() == true)
            {
                var prodGuids = inventorySearch.ProductId
                    .Select(id => Guid.TryParse(id, out var g) ? g : Guid.Empty)
                    .Where(g => g != Guid.Empty)
                    .ToList();

                if (prodGuids.Any())
                {
                    query = query.Where(inv => prodGuids.Contains(inv.ProductId));
                }
            }

            // 4) Filter by WarehouseId
            if (inventorySearch.WarehouseId?.Any() == true)
            {
                var whGuids = inventorySearch.WarehouseId
                    .Select(id => Guid.TryParse(id, out var g) ? g : Guid.Empty)
                    .Where(g => g != Guid.Empty)
                    .ToList();

                if (whGuids.Any())
                {
                    query = query.Where(inv => whGuids.Contains(inv.WarehouseId));
                }
            }

            // 5) Filter by CurrentLocationId
            if (inventorySearch.LocationId?.Any() == true)
            {
                var locGuids = inventorySearch.LocationId
                    .Select(id => Guid.TryParse(id, out var g) ? g : Guid.Empty)
                    .Where(g => g != Guid.Empty)
                    .ToList();

                if (locGuids.Any())
                {
                    query = query.Where(inv => locGuids.Contains(inv.CurrentLocationId));
                }
            }

            // 6) Filter by ClientCode on the Product
            if (inventorySearch.ClientCode?.Any() == true)
            {
                // Parse string codes into enum values
                var clientCodes = inventorySearch.ClientCode
                    .Select(code => Enum.TryParse<ClientCodeEnum>(code, out var c) ? (ClientCodeEnum?)c : null)
                    .Where(c => c.HasValue)
                    .Select(c => c!.Value)
                    .ToList();

                if (clientCodes.Any())
                {
                    query = query
                        .Join(_context.Products,
                              inv => inv.ProductId,
                              prod => prod.Id,
                              (inv, prod) => new { inv, prod })
                        .Where(x => clientCodes.Contains(x.prod.ClientCode))
                        .Select(x => x.inv);
                }
            }

            return query;
        }

        public static string GetEnumDescription<T>(T enumValue) where T : Enum
        {
            var fieldInfo = enumValue.GetType().GetField(enumValue.ToString());
            var attributes = (DescriptionAttribute[])fieldInfo!.GetCustomAttributes(typeof(DescriptionAttribute), false);

            return attributes.Length > 0 ? attributes[0].Description : enumValue.ToString();
        }
    }
}
