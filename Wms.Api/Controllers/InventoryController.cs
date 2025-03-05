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

        public InventoryController(IService<Inventory> service, ApplicationDbContext context, IMapper autoMapperService)
        {
            _service = service;
            _autoMapperService = autoMapperService;
            _context = context;
        }
         

        [HttpPost("search", Name = "SearchInventorysAsync")]
        public async Task<IActionResult> SearchInventorysAsync([FromBody] InventorySearchDto inventorySearch)
        {
            var inventorys = await _service.GetAllAsync();

            var result = inventorys.Skip((inventorySearch.Page - 1) * inventorySearch.PageSize).Take(inventorySearch.PageSize).ToList();
            PagedList<Inventory> pagedResult = new PagedList<Inventory>(result, inventorySearch.Page, inventorySearch.PageSize);

            var inventoryDtos = _autoMapperService.Map<PagedListDto<InventoryDetailsDto>>(pagedResult);

            foreach (var inventory in inventoryDtos.Data)
            {
                inventory.Product = _context.Products?.Where(x => x.Id == inventory.ProductId)?.FirstOrDefault()?.Name ?? "";
                inventory.Warehouse = _context.Warehouses?.Where(x => x.Id == inventory.WarehouseId)?.FirstOrDefault()?.Name ?? "";
                inventory.CurrentLocation = _context.Locations?.Where(x => x.Id == inventory.CurrentLocationId)?.FirstOrDefault()?.Name ?? "";                
            } 

            return Ok(inventoryDtos);
        }

        [HttpPost("count", Name = "CountInventorysAsync")]
        public async Task<IActionResult> CountInventorysAsync([FromBody] InventorySearchDto inventorySearch)
        {
            var inventorys = await _service.GetAllAsync();

            var inventoryDtos = _autoMapperService.Map<List<InventoryDetailsDto>>(inventorys);
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
    }
}
