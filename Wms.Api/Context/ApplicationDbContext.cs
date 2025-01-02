using Microsoft.EntityFrameworkCore;
using Wms.Api.Entities;

namespace Wms.Api.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductUom> ProductUoms { get; set; }
        public DbSet<StockIn> StockIns { get; set; }
        public DbSet<StockInItem> StockInDetails { get; set; }
        public DbSet<StockOut> StockOuts { get; set; }
        public DbSet<StockOutItem> StockOutDetails { get; set; }
        public DbSet<CustomerReturn> CustomerReturns { get; set; }
    }
}
