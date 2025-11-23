using Microsoft.AspNetCore.Http;
using System;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;
using Wms.Api.Dto.Product.ProductCreateUpdate;
using Wms.Api.Dto.Product.ProductDetails;
using Wms.Api.Dto.Product.ProductSearch;
using Wms.Api.Entities;

namespace Wms.Api.Services
{
    public interface IProductService
    {
        Task<PagedListDto<SelectOptionV12Dto>> GetSelectOptionsAsync(GlobalSelectFilterV12Dto selectFilterV12Dto);
        Task<PagedListDto<ProductDetailsDto>> SearchProductsAsync(ProductSearchDto productSearchDto);
        Task<int> CountProductsAsync(ProductSearchDto productSearchDto);
        Task<ProductDetailsDto?> GetProductByIdAsync(Guid id);
        Task<Product> CreateAsync(ProductCreateUpdateDto productCreateUpdateDto);
        Task<bool> UpdateAsync(Guid id, ProductCreateUpdateDto productCreateUpdateDto);
        Task DeleteAsync(Guid id);
        Task<PagedListDto<ProductDetailsDto>> FindProductsByIdsAsync(Guid[] productIds, int page, int pageSize);
        Task<(bool IsSuccess, string ErrorMessage)> BulkUploadProducts(IFormFile file);
    }
}
