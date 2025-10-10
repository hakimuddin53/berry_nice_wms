using AutoMapper;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;
using Wms.Api.Dto.Product.ProductCreateUpdate;
using Wms.Api.Dto.Product.ProductDetails;
using Wms.Api.Dto.Product.ProductSearch;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;
using Wms.Api.Repositories.Interface;
using Wms.Api.Repositories;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ProductController(
        IService<Product> service,
        IMapper autoMapperService,
        ApplicationDbContext context,
        //IProductService productService,
        IProductRepository productRepository)
        : ControllerBase
    {
        [HttpGet("select-options")]
        [ProducesResponseType(typeof(PagedListDto<SelectOptionV12Dto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSelectOptionsAsync([FromQuery] GlobalSelectFilterV12Dto selectFilterV12Dto)
        {
            // Build the filter expression
            var predicate = PredicateBuilder.New<Product>(true);

            if (selectFilterV12Dto.Ids != null)
            {
                var productIds = selectFilterV12Dto.Ids.Select(id => Guid.TryParse(id, out var pid) ? pid : Guid.Empty).Where(pid => pid != Guid.Empty).ToArray();
                predicate = predicate.And(product => productIds.Contains(product.ProductId));
            }

            if (selectFilterV12Dto.SearchString != null)
            {
                predicate = predicate.And(product =>
                    product.ProductCode.Contains(selectFilterV12Dto.SearchString));

            }

            // Use the reusable pagination method
            var paginatedResult = await service.GetPaginatedAsync(predicate, new Paginator
            {
                Page = selectFilterV12Dto.Page,
                PageSize = selectFilterV12Dto.PageSize,
            });

            var resultToList = await paginatedResult.ToListAsync();


            PagedList<Product> pagedResult = new PagedList<Product>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var stockInDtos = autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(stockInDtos);
        }        [HttpPost("search", Name = "SearchProductsAsync")]
        public async Task<IActionResult> SearchProductsAsync([FromBody] ProductSearchDto stockInSearch)
        {
            var products = await service.GetAllAsync(e => e.ProductCode.Contains(stockInSearch.search));

            var result = products.Skip((stockInSearch.Page - 1) * stockInSearch.PageSize).Take(stockInSearch.PageSize).ToList();
             
            PagedList<Product> pagedResult = new PagedList<Product>(result, stockInSearch.Page, stockInSearch.PageSize);

            var productDtos = autoMapperService.Map<PagedListDto<ProductDetailsDto>>(pagedResult);

            return Ok(productDtos);
        }

        [HttpPost("count", Name = "CountProductsAsync")]
        public async Task<IActionResult> CountProductsAsync([FromBody] ProductSearchDto stockInSearch)
        {
            var stockIns = await service.GetAllAsync(e => e.ProductCode.Contains(stockInSearch.search));

            var stockInDtos = autoMapperService.Map<List<ProductDetailsDto>>(stockIns);
            return Ok(stockInDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await productRepository.GetProductByIdWithLookupsAsync(id);

            if (product == null)
                return NotFound();

             
            var productDetails = autoMapperService.Map<ProductDetailsDto>(product);

            return Ok(productDetails);
        }

        //[HttpPost("bulk-upload")]
        //public async Task<IActionResult> BulkUploadProducts(IFormFile file)
        //{
        //    if (file == null || file.Length == 0)
        //    {
        //        return BadRequest("Please upload a valid file.");
        //    }

        //    var result = await productService.BulkUploadProducts(file);

        //    if (result.IsSuccess)
        //    {
        //        return Ok(new { message = "Products uploaded successfully." });
        //    }

        //    return BadRequest(result.ErrorMessage);
        //}

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductCreateUpdateDto productCreateUpdateDto)
        { 
            var product = autoMapperService.Map<Product>(productCreateUpdateDto);

            await service.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.ProductId }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ProductCreateUpdateDto productCreateUpdateDto)
        {
            var product = await service.GetByIdAsync(id);
            if (product == null)
                return NotFound();
             
            autoMapperService.Map(productCreateUpdateDto, product);

            await service.UpdateAsync(product);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await service.DeleteAsync(id);
            return NoContent();
        }
        
        [HttpGet(Name = "FindProductAsync")]
        public async Task<IActionResult> FindProductAsync([FromQuery] Guid[] productIds, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (productIds == null || productIds.Length == 0)
            {
                return BadRequest("ProductIds are required");
            }

            var productsQuery = await service.GetAllAsync(e => productIds.Contains(e.ProductId));

            var result = productsQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            PagedList<Product> pagedResult = new PagedList<Product>(
                result, 
                page, 
                pageSize);

            var productDtos = autoMapperService.Map<PagedListDto<ProductDetailsDto>>(pagedResult);

            return Ok(productDtos);
        }

        public static string GetEnumDescription<T>(T enumValue) where T : Enum
        {
            var fieldInfo = enumValue.GetType().GetField(enumValue.ToString());
            var attributes = (DescriptionAttribute[])fieldInfo!.GetCustomAttributes(typeof(DescriptionAttribute), false);

            return attributes.Length > 0 ? attributes[0].Description : enumValue.ToString();
        }
    }
}
