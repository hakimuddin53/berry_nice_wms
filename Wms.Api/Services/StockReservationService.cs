using DocumentFormat.OpenXml.Vml;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Entities;
using Wms.Api.Model;

namespace Wms.Api.Services
{
    public class StockReservationService(ApplicationDbContext context) : IStockReservationService
    {
        public async Task RequestCancellationAsync(Guid reservationId, string requestedBy, string remark)
        {
            var r = await context.StockReservations.FindAsync(reservationId)
                    ?? throw new KeyNotFoundException("Reservation not found");

            if (r.Status != ReservationStatusEnum.ACTIVE)
                throw new InvalidOperationException("Only Active reservations can be cancelled.");

            r.Status = ReservationStatusEnum.CANCELREQUESTED;
            r.CancellationRequestedBy = requestedBy;
            r.CancellationRequestedAt = DateTime.UtcNow;
            r.CancellationRemark = remark; //TODO update later

            await context.SaveChangesAsync();
        }

        public async Task ApproveCancellationAsync(Guid reservationId, string approvedBy)
        {
            var r = await context.StockReservations.FindAsync(reservationId)
                    ?? throw new KeyNotFoundException("Reservation not found");

            if (r.Status != ReservationStatusEnum.CANCELREQUESTED)
                throw new InvalidOperationException("No pending cancellation request.");

            if (r.StockReservationItems != null && r.StockReservationItems.Any()) // Ensure StockReservationItems is not null and has items
            {
                foreach (var item in r.StockReservationItems)
                {
                    var wh = await context.WarehouseInventoryBalances.SingleAsync(w =>
                        w.ProductId == item.ProductId &&
                        w.WarehouseId == r.WarehouseId);

                    wh.ReservedQuantity -= item.Quantity;
                }

                r.Status = ReservationStatusEnum.CANCELLED;
                r.CancellationApprovedBy = approvedBy;
                r.CancellationApprovedAt = DateTime.UtcNow;
            }

            await context.SaveChangesAsync();
        }

        public async Task ReserveAsync(Guid productId, Guid warehouseId, int qty)
        {
            var wh = await context.WarehouseInventoryBalances
                .SingleOrDefaultAsync(w =>
                    w.ProductId == productId &&
                    w.WarehouseId == warehouseId)
                ?? throw new InvalidOperationException("Warehouse balance not found");

            if (qty <= 0)
                throw new ArgumentException("Quantity must be > 0", nameof(qty));

            if (wh.ReservedQuantity + qty > wh.OnHandQuantity)
                throw new InvalidOperationException(
                    $"Cannot reserve {qty} units; only {wh.AvailableForPicking} available.");

            wh.ReservedQuantity += qty;
            await context.SaveChangesAsync();
        }

        public async Task<List<ActiveReservationItemDto>> GetActiveReservationAsync(Guid productId, Guid warehouseId)
        {
            var active = await context.StockReservations
                .Where(r => r.Status == ReservationStatusEnum.ACTIVE
                         && r.WarehouseId == warehouseId)
                .SelectMany(r => r.StockReservationItems ?? Enumerable.Empty<StockReservationItem>(),
                    (r, item) => new { r, item })
                .Where(x => x.item.ProductId == productId && x.item.Quantity > 0)
                .Select(x => new ActiveReservationItemDto
                {
                    ReservationId = x.r.Id,
                    Number = x.r.Number,
                    ReservedAt = x.r.ReservedAt,
                    ExpiresAt = x.r.ExpiresAt,
                    ReservationItemId = x.item.Id,
                    Quantity = x.item.Quantity
                })
                .ToListAsync();

            return active;
        }

        /// <summary>
        /// Finds all Active reservations older than 3 days, releases them (returns reserved qty).
        /// </summary>
        public async Task ReleaseExpiredReservationsAsync()
        {
            var cutoff = DateTime.UtcNow.AddDays(-3);
            var expired = await context.StockReservations
                .Include(x => x.StockReservationItems)
                .Where(x => x.Status == ReservationStatusEnum.ACTIVE
                         && x.ReservedAt <= cutoff)
                .ToListAsync();

            if (!expired.Any()) return;

            foreach (var r in expired)
            {
                if (r.StockReservationItems != null && r.StockReservationItems.Any()) // Ensure StockReservationItems is not null and has items
                {
                    foreach (var item in r.StockReservationItems)
                    {
                        var wh = await context.WarehouseInventoryBalances.SingleAsync(w =>
                            w.ProductId == item.ProductId &&
                            w.WarehouseId == r.WarehouseId);

                        // release reserved back to available
                        wh.ReservedQuantity -= item.Quantity;
                        // on-hand was never touched for a reservation
                    }
                }

                r.Status = ReservationStatusEnum.RELEASED;
            }

            await context.SaveChangesAsync();
        }

        public async Task FulfillAsync(Guid reservationItemId)
        {
            var line = await context.StockReservationItems 
                .SingleOrDefaultAsync(li => li.Id == reservationItemId);

            if (line == null)
                throw new KeyNotFoundException($"No reservation item found for Id {reservationItemId}.");

            var reservation = await context.StockReservations.SingleOrDefaultAsync(r => r.Id == line.StockReservationId);
            if (reservation == null)
                throw new KeyNotFoundException($"Reservation {line.StockReservationId} not found.");

            if (reservation.Status != ReservationStatusEnum.ACTIVE)
                throw new InvalidOperationException("Only ACTIVE reservations can be fulfilled.");
             
            var wh = await context.WarehouseInventoryBalances.SingleOrDefaultAsync(w =>
                    w.ProductId == line.ProductId &&
                    w.WarehouseId == reservation.WarehouseId);

            if (wh == null)
                throw new InvalidOperationException("Warehouse balance missing—cannot fulfill reservation.");

            wh.ReservedQuantity -= line.Quantity;


            line.Status = ReservationItemStatusEnum.FULFILLED;

            if (reservation.StockReservationItems != null && (reservation.StockReservationItems.All(li => li.Status == ReservationItemStatusEnum.FULFILLED)))
            {
                reservation.Status = ReservationStatusEnum.FULFILLED;
            }

            await context.SaveChangesAsync();
        } 
    }
     
    public class ActiveReservationItemDto
    {
        public Guid ReservationId { get; set; }
        public string Number { get; set; }
        public DateTime ReservedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public Guid ReservationItemId { get; set; }
        public int Quantity { get; set; }
    }
}