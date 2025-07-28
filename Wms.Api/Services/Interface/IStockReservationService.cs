namespace Wms.Api.Services
{
    public interface IStockReservationService
    {
        Task FulfillAsync(Guid reservationItemId);
        Task RequestCancellationAsync(Guid reservationId, string requestedBy, string remark);
        Task ApproveCancellationAsync(Guid reservationId, string approvedBy);
        Task ReleaseExpiredReservationsAsync();
        Task ReserveAsync(Guid productId, Guid warehouseId, int qty);
        Task<List<ActiveReservationItemDto>> GetActiveReservationAsync(Guid productId, Guid warehouseId);
    }
}