using System;
using System.Linq;
using AutoMapper;
using LinqKit;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;
using Wms.Api.Dto.Product.ProductCreateUpdate;
using Wms.Api.Dto.Product.ProductDetails;
using Wms.Api.Dto.Product.ProductSearch;
using Wms.Api.Entities;
using Wms.Api.Model;

namespace Wms.Api.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IService<Product> _service;
        private readonly IRunningNumberService _runningNumberService;

        public ProductService(
            ApplicationDbContext context,
            IMapper mapper,
            IService<Product> service,
            IRunningNumberService runningNumberService)
        {
            _context = context;
            _mapper = mapper;
            _service = service;
            _runningNumberService = runningNumberService;
        }

        public async Task<PagedListDto<SelectOptionV12Dto>> GetSelectOptionsAsync(GlobalSelectFilterV12Dto selectFilterV12Dto)
        {
            var predicate = BuildProductFilter(selectFilterV12Dto.SearchString, selectFilterV12Dto.Ids);

            var paginatedResult = await QueryWithLookups()
                .Where(predicate)
                .OrderBy(p => p.ProductCode)
                .Skip((selectFilterV12Dto.Page - 1) * selectFilterV12Dto.PageSize)
                .Take(selectFilterV12Dto.PageSize)
                .ToListAsync();

            var pagedResult = new PagedList<Product>(paginatedResult, selectFilterV12Dto.Page, selectFilterV12Dto.PageSize);
            return _mapper.Map<PagedListDto<SelectOptionV12Dto>>(pagedResult);
        }

        public async Task<PagedListDto<ProductDetailsDto>> SearchProductsAsync(ProductSearchDto productSearchDto)
        {
            var predicate = BuildProductFilter(productSearchDto.search);

            var products = await QueryWithLookups()
                .Where(predicate)
                .OrderBy(p => p.ProductCode)
                .Skip((productSearchDto.Page - 1) * productSearchDto.PageSize)
                .Take(productSearchDto.PageSize)
                .ToListAsync();

            var pagedResult = new PagedList<Product>(products, productSearchDto.Page, productSearchDto.PageSize);
            return _mapper.Map<PagedListDto<ProductDetailsDto>>(pagedResult);
        }

        public async Task<int> CountProductsAsync(ProductSearchDto productSearchDto)
        {
            var predicate = BuildProductFilter(productSearchDto.search);
            return await QueryWithLookups().Where(predicate).CountAsync();
        }

        public async Task<ProductDetailsDto?> GetProductByIdAsync(Guid id)
        {
            var product = await QueryWithLookups(false)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            return product == null ? null : _mapper.Map<ProductDetailsDto>(product);
        }

        public async Task<Product> CreateAsync(ProductCreateUpdateDto productCreateUpdateDto)
        {
            var product = _mapper.Map<Product>(productCreateUpdateDto);
            product.ProductCode = await _runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.PRODUCT);

            await _service.AddAsync(product);
            return product;
        }

        public async Task<bool> UpdateAsync(Guid id, ProductCreateUpdateDto productCreateUpdateDto)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null)
            {
                return false;
            }

            var existingProductCode = product.ProductCode;
            _mapper.Map(productCreateUpdateDto, product);
            product.ProductCode = existingProductCode;

            await _service.UpdateAsync(product);
            return true;
        }

        public async Task DeleteAsync(Guid id)
        {
            await _service.DeleteAsync(id);
        }

        public async Task<PagedListDto<ProductDetailsDto>> FindProductsByIdsAsync(Guid[] productIds, int page, int pageSize)
        {
            var products = await QueryWithLookups()
                .Where(product => productIds.Contains(product.ProductId))
                .OrderBy(p => p.ProductCode)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var pagedResult = new PagedList<Product>(products, page, pageSize);
            return _mapper.Map<PagedListDto<ProductDetailsDto>>(pagedResult);
        }

        public Task<(bool IsSuccess, string ErrorMessage)> BulkUploadProducts(IFormFile file)
        {
            // Bulk upload is not implemented for the current product model.
            return Task.FromResult((false, "Bulk upload is not supported for this product version."));
        }

        private IQueryable<Product> QueryWithLookups(bool asNoTracking = true)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Color)
                .Include(p => p.Storage)
                .Include(p => p.Ram)
                .Include(p => p.Processor)
                .Include(p => p.ScreenSize);

            return asNoTracking ? query.AsNoTracking() : query;
        }

        private static ExpressionStarter<Product> BuildProductFilter(string? searchTerm, string[]? ids = null)
        {
            var predicate = PredicateBuilder.New<Product>(true);

            if (ids != null && ids.Length > 0)
            {
                var productIds = ids
                    .Select(id => Guid.TryParse(id, out var parsedId) ? parsedId : Guid.Empty)
                    .Where(id => id != Guid.Empty)
                    .ToArray();

                if (productIds.Length > 0)
                {
                    predicate = predicate.And(product => productIds.Contains(product.ProductId));
                }
            }

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var search = searchTerm.Trim();
                predicate = predicate.And(product =>
                    product.ProductCode.Contains(search) ||
                    (product.Model != null && product.Model.Contains(search)) ||
                    (product.PrimarySerialNumber != null && product.PrimarySerialNumber.Contains(search)) ||
                    (product.ManufactureSerialNumber != null && product.ManufactureSerialNumber.Contains(search)));
            }

            return predicate;
        }
    }
}
