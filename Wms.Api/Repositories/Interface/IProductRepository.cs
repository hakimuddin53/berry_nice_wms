using System.Threading.Tasks;
using Wms.Api.Entities;

namespace Wms.Api.Repositories
{
    public interface IProductRepository
    {
        Task AddProductAsync(Product product, bool saveChanges = false);
        Task<Guid> GetOrCreateCategoryIdAsync(string categoryName);
        Task<Guid> GetOrCreateSizeIdAsync(string sizeName);
        Task<Guid> GetOrCreateColourIdAsync(string colourName);
        Task<Guid> GetOrCreateDesignIdAsync(string designName);
        Task<Guid> GetOrCreateCartonSizeIdAsync(string cartonSizeName);
        Task<Product?> GetProductByItemCodeAsync(string itemCode);
        Task<Guid> GetFirstWarehouseIdAsync();
        Task AddInventoryRecordAsync(Inventory inventory);
        Task SaveChangesAsync();
    }
}