using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Entities; 
using Wms.Api.Model;

namespace Wms.Api.Data.Seeding
{
    public static class LookupSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext db, ILogger logger, CancellationToken ct = default)
        {
            await db.Database.MigrateAsync(ct);

            var seeds = GetSeeds();

            // existing as (enum, label)
            var existing = await db.Lookups
                .Select(l => new { l.GroupKey, l.Label })
                .ToListAsync(ct);
            var existingSet = existing.Select(x => (x.GroupKey, x.Label)).ToHashSet();

            var toAdd = seeds.Where(s => !existingSet.Contains((s.GroupKey, s.Label))).ToList();
            if (toAdd.Count == 0)
            {
                logger.LogInformation("LookupSeeder: no new items to seed.");
                return;
            }

            await db.Lookups.AddRangeAsync(toAdd, ct);
            await db.SaveChangesAsync(ct);
            logger.LogInformation("LookupSeeder: seeded {Count} items.", toAdd.Count);
        }

        private static List<Lookup> GetSeeds()
        {
            static Lookup L(LookupGroupKey g, string label, int sort, bool active = true)
                => new Lookup { GroupKey = g, Label = label, SortOrder = sort, IsActive = active };

            var list = new List<Lookup>();

            // --- CustomerType
            list.AddRange(new[]
            {
                L(LookupGroupKey.CustomerType,"Retail",1),
                L(LookupGroupKey.CustomerType,"Dealer",2),
                L(LookupGroupKey.CustomerType,"Agent",3),
            });

            // --- SalesType
            list.AddRange(new[]
            {
                L(LookupGroupKey.SalesType,"Walk In",1),
                L(LookupGroupKey.SalesType,"Postage",2),
                L(LookupGroupKey.SalesType,"COD",3),
                L(LookupGroupKey.SalesType,"Lalamove",4),
            });

            // --- PaymentType
            list.AddRange(new[]
            {
                L(LookupGroupKey.PaymentType,"Cash",1),
                L(LookupGroupKey.PaymentType,"Transfer",2),
                L(LookupGroupKey.PaymentType,"Cheque",3),
                L(LookupGroupKey.PaymentType,"Master/Visa/Credit Card",4),
                L(LookupGroupKey.PaymentType,"Card + Transfer",5),
                L(LookupGroupKey.PaymentType,"Card + Cash",6),
                L(LookupGroupKey.PaymentType,"Cash + Transfer",7),
                L(LookupGroupKey.PaymentType,"Trade in (Swap)",8),
                L(LookupGroupKey.PaymentType,"Trade in",9),
                L(LookupGroupKey.PaymentType,"Wrong Key in",98),
                L(LookupGroupKey.PaymentType,"Double_Entry",99),
            });

            // --- Location (isSellable in meta)
            list.AddRange(new[]
            {
                L(LookupGroupKey.Location,"STOCK",1),
                L(LookupGroupKey.Location,"MISSING",2),
                L(LookupGroupKey.Location,"DAMAGED GOODS",3),
                L(LookupGroupKey.Location,"REFUND",4),
                L(LookupGroupKey.Location,"OUTSOURCE",5),
                L(LookupGroupKey.Location,"OUTSOURCE_REPAIR",6),
                L(LookupGroupKey.Location,"IMTIAZ",7),
                L(LookupGroupKey.Location,"BALI",8),
                L(LookupGroupKey.Location,"CLAIM",9),
            });

            // --- Warehouse
            list.AddRange(new[]
            {
                L(LookupGroupKey.Warehouse,"BerryNice LSH33",1),
                L(LookupGroupKey.Warehouse,"BerryNice Sri Rampai",2),
            });

            // --- Region / Condition
            list.Add(L(LookupGroupKey.Region, "MY/A", 1));
            list.Add(L(LookupGroupKey.NewOrUsed, "NEW", 1));
            list.Add(L(LookupGroupKey.NewOrUsed, "USED", 2));

            // --- Grade
            list.AddRange(new[]
            {
                L(LookupGroupKey.Grade, "AA", 1),
                L(LookupGroupKey.Grade, "AB", 2),
                L(LookupGroupKey.Grade, "AC", 3),
                L(LookupGroupKey.Grade, "AD", 4),
                L(LookupGroupKey.Grade, "AE", 5),
                L(LookupGroupKey.Grade, "AG", 6),
            });

            // --- Inventory Status
            list.AddRange(new[]
            {
                L(LookupGroupKey.InventoryStatus,"In Stock",1),
                L(LookupGroupKey.InventoryStatus,"Reserved",2),
                L(LookupGroupKey.InventoryStatus,"Sold",3),
                L(LookupGroupKey.InventoryStatus,"Missing",4),
                L(LookupGroupKey.InventoryStatus,"Damaged",5),
                L(LookupGroupKey.InventoryStatus,"Outsource",6),
                L(LookupGroupKey.InventoryStatus,"Refund",7),
            });

            // --- Product Category
            list.AddRange(new[]
            {
                L(LookupGroupKey.ProductCategory,"Phone",1),
                L(LookupGroupKey.ProductCategory,"Laptop",2),
                L(LookupGroupKey.ProductCategory,"Accessory",3),
                L(LookupGroupKey.ProductCategory,"Service",4),
            });

            // --- Expense Category
            list.AddRange(new[]
            {
                L(LookupGroupKey.ExpenseCategory,"Internet and Telephone",1),
                L(LookupGroupKey.ExpenseCategory,"Freight",2),
                L(LookupGroupKey.ExpenseCategory,"Software",3),
                L(LookupGroupKey.ExpenseCategory,"Staff Refreshment",4),
                L(LookupGroupKey.ExpenseCategory,"Advertising",5),
                L(LookupGroupKey.ExpenseCategory,"Tax",6),
                L(LookupGroupKey.ExpenseCategory,"Part and Accessories",7),
                L(LookupGroupKey.ExpenseCategory,"Outsourcing Repair",8),
            });

            // --- ScreenSize
            string[] sizes = { "4.7", "5.0", "5.5", "6.1", "6.4", "6.5", "6.7", "7", "8", "10.2", "11", "12.9", "13.3", "14", "15.6" };
            for (int i = 0; i < sizes.Length; i++)
                list.Add(L(LookupGroupKey.ScreenSize, $"{sizes[i]}\"", i + 1));

            // --- Color
            string[] colors = { "Black", "White", "Silver", "Grey", "Space Gray", "Blue", "Gold", "Green", "Red", "Purple", "Pink" };
            for (int i = 0; i < colors.Length; i++)
                list.Add(L(LookupGroupKey.Color, colors[i], i + 1));

            // --- Storage
            foreach (var cap in new[] { "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB" })
                list.Add(L(LookupGroupKey.Storage, cap, list.Count));

            // --- Ram
            foreach (var cap in new[] { "2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB", "24GB", "32GB", "64GB" })
                list.Add(L(LookupGroupKey.Ram, cap, list.Count));

            // --- Processor
            list.AddRange(new[]
            {
                L(LookupGroupKey.Processor,"Intel i5",1),
                L(LookupGroupKey.Processor,"Intel i7",2),
            });

            // --- Brand
            list.AddRange(new[]
            {
                L(LookupGroupKey.Brand,"Acer",1),
                L(LookupGroupKey.Brand,"Honor",2),
                L(LookupGroupKey.Brand,"Apple",3),
            });

            // --- Remark (used in Stock Receive items / product remarks)
            list.AddRange(new[]
            {
                L(LookupGroupKey.Remark,"Faulty",1),
                L(LookupGroupKey.Remark,"Screen Crack",2),
                L(LookupGroupKey.Remark,"No Display",3),
                L(LookupGroupKey.Remark,"Battery rosak",4),
                L(LookupGroupKey.Remark,"Motherboard faulty",5),
                L(LookupGroupKey.Remark,"Power adapter issue",6),
            });

            // --- Logbook Status (used by Logbook module)
            list.AddRange(new[]
            {
                L(LookupGroupKey.LogbookStatus, "OUT", 1),
                L(LookupGroupKey.LogbookStatus, "RETURNED", 2),
            });

            return list;
        }
    }
}
