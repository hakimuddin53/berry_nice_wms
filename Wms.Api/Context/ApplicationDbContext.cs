using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Entities;
using Wms.Api.Services;

namespace Wms.Api.Context
{
    public class ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        ICurrentUserService currentUserService)
        : IdentityDbContext<ApplicationUser, ApplicationRole, string>(options)
    {
        public override int SaveChanges()
        {
            UpdateAuditEntities();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateAuditEntities()
        {
            var entries = ChangeTracker.Entries<CreatedChangedEntity>();
            string user = "df06e9cf-ab07-4e33-8004-2aad988eb251";
            try
            {
                user = currentUserService.UserId();
            }
            catch (Exception)
            {
                // If the user is not authenticated, use a default user ID or handle accordingly.
                // Here we are using a hardcoded GUID for demonstration purposes.
                user = "df06e9cf-ab07-4e33-8004-2aad988eb251";
            }

            foreach (var entry in entries)
            {
                var now = DateTime.UtcNow;
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = now;
                    entry.Entity.CreatedById = Guid.Parse(user);
                }

                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.ChangedAt = now;
                    entry.Entity.ChangedById = Guid.Parse(user);
                }

                _ = now.AddTicks(1);
            }
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<StockAdjustment> StockAdjustments { get; set; }
        public DbSet<StockAdjustmentItem> StockAdjustmentItems { get; set; }
        public DbSet<StockIn> StockIns { get; set; }
        public DbSet<StockInItem> StockInItems { get; set; }
        public DbSet<StockOut> StockOuts { get; set; }
        public DbSet<StockOutItem> StockOutItems { get; set; }
        public DbSet<Inventory> Inventories { get; set; }         
        public DbSet<StockReservation> StockReservations { get; set; }
        public DbSet<StockReservationItem> StockReservationItems { get; set; }
        public DbSet<StockTransfer> StockTransfers { get; set; }
        public DbSet<StockTransferItem> StockTransferItems { get; set; }
        public DbSet<RunningNumber> RunningNumbers { get; set; } 
        public DbSet<InventoryBalance> InventoryBalances { get; set; }
        public DbSet<WarehouseInventoryBalance> WarehouseInventoryBalances { get; set; }
        public DbSet<Lookup> Lookups { get; set; }
    }
}
