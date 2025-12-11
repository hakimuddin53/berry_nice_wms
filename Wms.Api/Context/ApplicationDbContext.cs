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
        public DbSet<StockRecieve> StockRecieves { get; set; }
        public DbSet<StockRecieveItem> StockRecieveItems { get; set; }
    // Removed: StockRecieveItemRemarks (replaced with single Remark field on StockRecieveItem)
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<RunningNumber> RunningNumbers { get; set; } 
        public DbSet<Lookup> Lookups { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }
    // Removed: ProductRemarks (replaced with single Remark field on Product)

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Product relationships with Lookup
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Brand)
                .WithMany()
                .HasForeignKey(p => p.BrandId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Color)
                .WithMany()
                .HasForeignKey(p => p.ColorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Storage)
                .WithMany()
                .HasForeignKey(p => p.StorageId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Ram)
                .WithMany()
                .HasForeignKey(p => p.RamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Processor)
                .WithMany()
                .HasForeignKey(p => p.ProcessorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.ScreenSize)
                .WithMany()
                .HasForeignKey(p => p.ScreenSizeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StockRecieveItem>()
                .HasOne(i => i.Product)
                .WithMany()
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Remarks are now simple string fields; related tables removed.

            modelBuilder.Entity<InvoiceItem>()
                .HasOne(ii => ii.Invoice)
                .WithMany(i => i.InvoiceItems)
                .HasForeignKey(ii => ii.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

