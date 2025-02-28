using AutoMapper;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Drawing;
using System.Linq.Expressions;
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
    public class ProductController : ControllerBase
    {
        private readonly IService<Product> _service;
        private readonly IRunningNumberService _runningNumberService;
        private readonly IMapper _autoMapperService;
        private readonly ApplicationDbContext _context;

        public ProductController(IService<Product> service, IMapper autoMapperService, ApplicationDbContext context, IRunningNumberService runningNumberService)
        {
            _service = service;
            _autoMapperService = autoMapperService;
            _context = context;
            _runningNumberService = runningNumberService;
        }


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
                    product.Name.Contains(selectFilterV12Dto.SearchString));
            }

            // Use the reusable pagination method
            var paginatedResult = await _service.GetPaginatedAsync(predicate, new Paginator
            {
                Page = selectFilterV12Dto.Page,
                PageSize = selectFilterV12Dto.PageSize,
            });

            var resultToList = await paginatedResult.ToListAsync();

            PagedList<Product> pagedResult = new PagedList<Product>(resultToList, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);

            var stockInDtos = _autoMapperService.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
            return Ok(stockInDtos);
        }

        [HttpPost("search", Name = "SearchProductsAsync")]
        public async Task<IActionResult> SearchProductsAsync([FromBody] ProductSearchDto stockInSearch)
        {
            var products = await _service.GetAllAsync(e => e.Name.Contains(stockInSearch.search));

            var result = products.Skip((stockInSearch.Page - 1) * stockInSearch.PageSize).Take(stockInSearch.PageSize).ToList();
             
            PagedList<Product> pagedResult = new PagedList<Product>(result, stockInSearch.Page, stockInSearch.PageSize);

            var productDtos = _autoMapperService.Map<PagedListDto<ProductDetailsDto>>(pagedResult);

            foreach (var product in productDtos.Data)
            {
                product.Category = _context.Categories?.Where(x => x.Id == product.CategoryId)?.FirstOrDefault()?.Name ?? "";
                product.Size = _context.Sizes?.Where(x => x.Id == product.SizeId)?.FirstOrDefault()?.Name ?? "";
                product.Colour = _context.Colours?.Where(x => x.Id == product.ColourId)?.FirstOrDefault()?.Name ?? "";
                product.Design = _context.Designs?.Where(x => x.Id == product.DesignId)?.FirstOrDefault()?.Name ?? "";
                product.CartonSize = _context.CartonSizes?.Where(x => x.Id == product.CartonSizeId)?.FirstOrDefault()?.Name ?? "";
                 
                product.ClientCodeString = GetEnumDescription(product.ClientCode);
            }
            return Ok(productDtos);
        }

        [HttpPost("count", Name = "CountProductsAsync")]
        public async Task<IActionResult> CountProductsAsync([FromBody] ProductSearchDto stockInSearch)
        {
            var stockIns = await _service.GetAllAsync(e => e.Name.Contains(stockInSearch.search));

            var stockInDtos = _autoMapperService.Map<List<ProductDetailsDto>>(stockIns);
            return Ok(stockInDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await _service.GetByIdAsync(id);

            if (product == null)
                return NotFound();

             
            var productDetails = _autoMapperService.Map<ProductDetailsDto>(product);

            productDetails.Category = _context.Categories?.Where(x => x.Id ==  productDetails.CategoryId)?.FirstOrDefault()?.Name ?? "";
            productDetails.Size = _context.Sizes?.Where(x => x.Id ==  productDetails.SizeId)?.FirstOrDefault()?.Name ?? "";
            productDetails.Colour = _context.Colours?.Where(x => x.Id ==  productDetails.ColourId)?.FirstOrDefault()?.Name ?? "";
            productDetails.Design = _context.Designs?.Where(x => x.Id ==  productDetails.DesignId)?.FirstOrDefault()?.Name ?? "";
            productDetails.CartonSize = _context.CartonSizes?.Where(x => x.Id ==  productDetails.CartonSizeId)?.FirstOrDefault()?.Name ?? "";
            
            productDetails.ClientCodeString = GetEnumDescription(productDetails.ClientCode);

            return Ok(productDetails);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductCreateUpdateDto productCreateUpdateDto)
        { 
            var product = _autoMapperService.Map<Product>(productCreateUpdateDto);
            string serialNumber = await _runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.PRODUCTSERIALNUMBER);
            product.SerialNumber = serialNumber;

            await _service.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ProductCreateUpdateDto productCreateUpdateDto)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null)
                return NotFound();
             
            _autoMapperService.Map(productCreateUpdateDto, product);

            await _service.UpdateAsync(product);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        public static string GetEnumDescription<T>(T enumValue) where T : Enum
        {
            var fieldInfo = enumValue.GetType().GetField(enumValue.ToString());
            var attributes = (DescriptionAttribute[])fieldInfo!.GetCustomAttributes(typeof(DescriptionAttribute), false);

            return attributes.Length > 0 ? attributes[0].Description : enumValue.ToString();
        }
    }
}
