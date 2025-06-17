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

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ProductController(
        IService<Product> service,
        IMapper autoMapperService,
        ApplicationDbContext context,
        IRunningNumberService runningNumberService,
        IProductService productService)
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
                predicate = predicate.And(product => selectFilterV12Dto.Ids.Contains(product.Id));
            }

            if (selectFilterV12Dto.SearchString != null)
            {
                predicate = predicate.And(product =>
                    product.Name.Contains(selectFilterV12Dto.SearchString) ||
                    product.ItemCode.Contains(selectFilterV12Dto.SearchString));

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
        }

        [HttpPost("search", Name = "SearchProductsAsync")]
        public async Task<IActionResult> SearchProductsAsync([FromBody] ProductSearchDto stockInSearch)
        {
            var products = await service.GetAllAsync(e => e.Name.Contains(stockInSearch.search));

            var result = products.Skip((stockInSearch.Page - 1) * stockInSearch.PageSize).Take(stockInSearch.PageSize).ToList();
             
            PagedList<Product> pagedResult = new PagedList<Product>(result, stockInSearch.Page, stockInSearch.PageSize);

            var productDtos = autoMapperService.Map<PagedListDto<ProductDetailsDto>>(pagedResult);

            foreach (var product in productDtos.Data)
            {
                product.Category = context.Categories?.Where(x => x.Id == product.CategoryId)?.FirstOrDefault()?.Name ?? "";
                product.Size = context.Sizes?.Where(x => x.Id == product.SizeId)?.FirstOrDefault()?.Name ?? "";
                product.Colour = context.Colours?.Where(x => x.Id == product.ColourId)?.FirstOrDefault()?.Name ?? "";
                product.Design = context.Designs?.Where(x => x.Id == product.DesignId)?.FirstOrDefault()?.Name ?? "";
                product.CartonSize = context.CartonSizes?.Where(x => x.Id == product.CartonSizeId)?.FirstOrDefault()?.Name ?? "";
                product.ClientCodeString = context.ClientCodes?.Where(x => x.Id == product.ClientCodeId)?.FirstOrDefault()?.Name ?? "";
            }
            return Ok(productDtos);
        }

        [HttpPost("count", Name = "CountProductsAsync")]
        public async Task<IActionResult> CountProductsAsync([FromBody] ProductSearchDto stockInSearch)
        {
            var stockIns = await service.GetAllAsync(e => e.Name.Contains(stockInSearch.search));

            var stockInDtos = autoMapperService.Map<List<ProductDetailsDto>>(stockIns);
            return Ok(stockInDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await service.GetByIdAsync(id);

            if (product == null)
                return NotFound();

             
            var productDetails = autoMapperService.Map<ProductDetailsDto>(product);

            productDetails.Category = context.Categories?.Where(x => x.Id ==  productDetails.CategoryId)?.FirstOrDefault()?.Name ?? "";
            productDetails.Size = context.Sizes?.Where(x => x.Id ==  productDetails.SizeId)?.FirstOrDefault()?.Name ?? "";
            productDetails.Colour = context.Colours?.Where(x => x.Id ==  productDetails.ColourId)?.FirstOrDefault()?.Name ?? "";
            productDetails.Design = context.Designs?.Where(x => x.Id ==  productDetails.DesignId)?.FirstOrDefault()?.Name ?? "";
            productDetails.CartonSize = context.CartonSizes?.Where(x => x.Id ==  productDetails.CartonSizeId)?.FirstOrDefault()?.Name ?? "";
            productDetails.ClientCodeString = context.ClientCodes?.Where(x => x.Id ==  productDetails.ClientCodeId)?.FirstOrDefault()?.Name ?? "";

            return Ok(productDetails);
        }

        [HttpPost("bulk-upload")]
        public async Task<IActionResult> BulkUploadProducts(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Please upload a valid file.");
            }

            var result = await productService.BulkUploadProducts(file);

            if (result.IsSuccess)
            {
                return Ok(new { message = "Products uploaded successfully." });
            }

            return BadRequest(result.ErrorMessage);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductCreateUpdateDto productCreateUpdateDto)
        { 
            var product = autoMapperService.Map<Product>(productCreateUpdateDto);
            string serialNumber = await runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.PRODUCT);
            product.SerialNumber = serialNumber;

            await service.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
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
        public async Task<IActionResult> FindProductAsync([FromQuery] ProductFindByParametersDto productFindByParametersDto)
        {
            var productIdsAsString = productFindByParametersDto.ProductIds.Select(id => id.ToString()).ToArray();

            var productsQuery = await service.GetAllAsync(e => productIdsAsString.Contains(e.Id.ToString()));

            var result = productsQuery
                .Skip((productFindByParametersDto.Page - 1) * productFindByParametersDto.PageSize)
                .Take(productFindByParametersDto.PageSize)
                .ToList();

            PagedList<Product> pagedResult = new PagedList<Product>(
                result, 
                productFindByParametersDto.Page, 
                productFindByParametersDto.PageSize);

            var productDtos = autoMapperService.Map<PagedListDto<ProductDetailsDto>>(pagedResult);

            foreach (var product in productDtos.Data)
            { 
                product.Size = context.Sizes?.Where(x => x.Id == product.SizeId)?.FirstOrDefault()?.Name ?? ""; 
            }

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
