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

            var userRole = await _roleManager.FindByIdAsync(user.UserRoleId.ToString());
            if (userRole != null)
            {
                stockGroupId = userRole.CartonSizeId;
            }

            // 1. Get the base filtered query
            var filteredQuery = GetFilteredInventoryQuery(stockGroupId);

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

            var filteredQuery = GetFilteredInventoryQuery(stockGroupId);

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
        private IQueryable<Inventory> GetFilteredInventoryQuery(string? stockGroupIdCsv)
        {
            var query = _context.Inventories.AsQueryable(); // Start with IQueryable

            List<Guid>? allowedCartonSizeIds = null;

            if (!string.IsNullOrWhiteSpace(stockGroupIdCsv))
            {
                allowedCartonSizeIds = stockGroupIdCsv
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .Select(idStr => Guid.TryParse(idStr, out var guid) ? guid : Guid.Empty)
                    .Where(guid => guid != Guid.Empty)
                    .ToList();
            }

            // Apply filter ONLY if allowedCartonSizeIds were found and are not empty
            if (allowedCartonSizeIds != null && allowedCartonSizeIds.Any())
            {
                // Efficiently filter by joining Inventory with Product
                // Only include Inventories where the linked Product's CartonSizeId is in the allowed list
                query = query
                    .Join(_context.Products, // Join Inventory...
                          inv => inv.ProductId, // ...on ProductId...
                          prod => prod.Id,     // ...with Product Id
                          (inv, prod) => new { Inventory = inv, Product = prod }) // Keep both
                    .Where(joined => allowedCartonSizeIds.Contains(joined.Product.CartonSizeId)) // Filter based on Product.CartonSizeId
                    .Select(joined => joined.Inventory); // Select only the Inventory part back
            }
            // If stockGroupIdCsv is null/empty or parsing yields no Guids, the filter is skipped,
            // and all inventories are considered (based on this specific filter).

            // --- Add other potential filters from inventorySearch here ---
            // Example: if (inventorySearch.WarehouseId.HasValue) query = query.Where(i => i.WarehouseId == inventorySearch.WarehouseId.Value);
            // Example: if (!string.IsNullOrWhiteSpace(inventorySearch.ProductName)) query = query.Where(i => _context.Products.Any(p => p.Id == i.ProductId && p.Name.Contains(inventorySearch.ProductName))); // Needs optimization if used often

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
