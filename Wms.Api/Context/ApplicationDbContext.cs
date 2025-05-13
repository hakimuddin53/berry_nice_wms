using Microsoft.AspNetCore.Identity;
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

            var now = DateTime.UtcNow;
            var user = currentUserService.UserId();

            foreach (var entry in entries)
            {
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
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<CartonSize> CartonSizes { get; set; }
        public DbSet<Design> Designs { get; set; }
        public DbSet<Colour> Colours { get; set; }
        public DbSet<Size> Sizes { get; set; }
        public DbSet<Location> Locations { get; set; } 
        public DbSet<ClientCode> ClientCodes { get; set; } 

    }
}
