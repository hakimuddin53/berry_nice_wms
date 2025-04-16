using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Wms.Api.Services
{
    public interface IProductService
    {
        Task<(bool IsSuccess, string ErrorMessage)> BulkUploadProducts(IFormFile file);
    }
}