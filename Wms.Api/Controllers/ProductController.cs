using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wms.Api.Dto;
using Wms.Api.Dto.Product.ProductCreateUpdate;
using Wms.Api.Dto.Product.ProductSearch;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ProductController(IProductService productService) : ControllerBase
    {
        [HttpGet("select-options")]
        public async Task<IActionResult> GetSelectOptionsAsync([FromQuery] GlobalSelectFilterV12Dto selectFilterV12Dto)
        {
            var options = await productService.GetSelectOptionsAsync(selectFilterV12Dto);
            return Ok(options);
        }

        [HttpPost("search", Name = "SearchProductsAsync")]
        public async Task<IActionResult> SearchProductsAsync([FromBody] ProductSearchDto StockRecieveSearch)
        {
            var products = await productService.SearchProductsAsync(StockRecieveSearch);
            return Ok(products);
        }

        [HttpPost("count", Name = "CountProductsAsync")]
        public async Task<IActionResult> CountProductsAsync([FromBody] ProductSearchDto StockRecieveSearch)
        {
            var count = await productService.CountProductsAsync(StockRecieveSearch);
            return Ok(count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await productService.GetProductByIdAsync(id);

            if (product is null)
                return NotFound();

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductCreateUpdateDto productCreateUpdateDto)
        {
            var product = await productService.CreateAsync(productCreateUpdateDto);
            return CreatedAtAction(nameof(GetById), new { id = product.ProductId }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ProductCreateUpdateDto productCreateUpdateDto)
        {
            var updated = await productService.UpdateAsync(id, productCreateUpdateDto);
            if (!updated)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await productService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet(Name = "FindProductAsync")]
        public async Task<IActionResult> FindProductAsync([FromQuery] Guid[] productIds, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (productIds == null || productIds.Length == 0)
            {
                return BadRequest("ProductIds are required");
            }

            var productDtos = await productService.FindProductsByIdsAsync(productIds, page, pageSize);
            return Ok(productDtos);
        }
    }
}

