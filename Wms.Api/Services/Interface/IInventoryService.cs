using Wms.Api.Entities;
using Wms.Api.Model;

namespace Wms.Api.Services
{
    public interface IInventoryService
    {
        Task StockOutAsync(StockOut stockOut);
        Task StockInAsync(StockIn stockIn);
        Task StockTransferAsync(StockTransfer stockTransfer);
    }
}
