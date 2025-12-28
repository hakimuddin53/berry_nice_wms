using Wms.Api.Entities;
using Wms.Api.Model;

namespace Wms.Api.Services
{
    public interface IInventoryService
    {
        Task StockRecieveAsync(StockRecieve StockRecieve);
        Task InvoiceAsync(Invoice invoice);
        Task<List<StockTransfer>> StockTransferAsync(StockTransferRequest request);
        Task<StockTake> StockTakeAsync(StockTakeRequest request);
    }
}
