using Wms.Api.Entities;
using Wms.Api.Model;

namespace Wms.Api.Services
{
    public interface IInventoryService
    {
        Task StockInAsync(StockIn stockIn);
    }
}
