using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Wms.Api.Context;
using Wms.Api.Entities;
using Wms.Api.Model;

namespace Wms.Api.Data.Seeding
{
    public static class ProductSeeder
    {
        private static readonly string[] ServiceProductCodes = new[] { "POSTAGE", "LALAMOVE", "ACCESSORY" };

        public static async Task SeedAsync(ApplicationDbContext db, ILogger logger, CancellationToken ct = default)
        {
            await db.Database.MigrateAsync(ct);

            var lookups = await db.Lookups
                .Where(l =>
                    (l.GroupKey == LookupGroupKey.ProductCategory && l.Label == "Service") ||
                    (l.GroupKey == LookupGroupKey.Location && l.Label == "STOCK") ||
                    (l.GroupKey == LookupGroupKey.NewOrUsed && l.Label == "NEW") ||
                    (l.GroupKey == LookupGroupKey.Grade && l.Label == "AA"))
                .Select(l => new { l.Id, l.GroupKey, l.Label })
                .ToListAsync(ct);

            var serviceCategoryId = lookups.FirstOrDefault(l => l.GroupKey == LookupGroupKey.ProductCategory && l.Label == "Service")?.Id ?? Guid.Empty;
            var stockLocationId = lookups.FirstOrDefault(l => l.GroupKey == LookupGroupKey.Location && l.Label == "STOCK")?.Id ?? Guid.Empty;
            var newConditionId = lookups.FirstOrDefault(l => l.GroupKey == LookupGroupKey.NewOrUsed && l.Label == "NEW")?.Id ?? Guid.Empty;
            var gradeAaId = lookups.FirstOrDefault(l => l.GroupKey == LookupGroupKey.Grade && l.Label == "AA")?.Id ?? Guid.Empty;

            if (serviceCategoryId == Guid.Empty || stockLocationId == Guid.Empty || newConditionId == Guid.Empty || gradeAaId == Guid.Empty)
            {
                logger.LogWarning("ProductSeeder: required lookups missing. Skipping product seed.");
                return;
            }

            var serviceCodesLower = ServiceProductCodes.Select(c => c.ToLower()).ToList();
            var existingCodes = (await db.Products
                    .Where(p => p.ProductCode != null && serviceCodesLower.Contains(p.ProductCode.ToLower()))
                    .Select(p => p.ProductCode)
                    .ToListAsync(ct))
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            var existingServiceProducts = await db.Products
                .Where(p => p.ProductCode != null && serviceCodesLower.Contains(p.ProductCode.ToLower()))
                .ToListAsync(ct);

            var updatedCount = 0;
            foreach (var product in existingServiceProducts)
            {
                if (product.LocationId == Guid.Empty)
                {
                    product.LocationId = stockLocationId;
                    updatedCount++;
                }
            }

            var toAdd = new List<Product>();

            foreach (var code in ServiceProductCodes)
            {
                if (existingCodes.Contains(code))
                {
                    continue;
                }

                toAdd.Add(new Product
                {
                    ProductId = Guid.NewGuid(),
                    ProductCode = code,
                    CategoryId = serviceCategoryId,
                    LocationId = stockLocationId,
                    GradeId = gradeAaId,
                    SerialNumber = code,
                    NewOrUsedId = newConditionId,
                    CostPrice = 0m,
                    CreatedDate = DateTime.UtcNow
                });
            }

            if (toAdd.Count == 0 && updatedCount == 0)
            {
                logger.LogInformation("ProductSeeder: no new service products to seed.");
                return;
            }

            if (toAdd.Count > 0)
            {
                await db.Products.AddRangeAsync(toAdd, ct);
            }
            await db.SaveChangesAsync(ct);

            if (updatedCount > 0)
            {
                logger.LogInformation(
                    "ProductSeeder: set STOCK location for {Count} service products.",
                    updatedCount
                );
            }

            logger.LogInformation("ProductSeeder: seeded {Count} service products.", toAdd.Count);
        }
    }
}
