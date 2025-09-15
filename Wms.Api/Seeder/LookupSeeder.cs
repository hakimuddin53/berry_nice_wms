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

            // existing as (enum, code)
            var existing = await db.Lookups
                .Select(l => new { l.GroupKey, l.Code })
                .ToListAsync(ct);
            var existingSet = existing.Select(x => (x.GroupKey, x.Code)).ToHashSet();

            var toAdd = seeds.Where(s => !existingSet.Contains((s.GroupKey, s.Code))).ToList();
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
            static Lookup L(LookupGroupKey g, string code, string label, int sort, string? meta = null, bool active = true)
                => new Lookup { GroupKey = g, Code = code, Label = label, SortOrder = sort, MetaJson = meta, IsActive = active };

            var list = new List<Lookup>();

            // --- CustomerType
            list.AddRange(new[]
            {
                L(LookupGroupKey.CustomerType,"RETAIL","Retail",1),
                L(LookupGroupKey.CustomerType,"DEALER","Dealer",2),
                L(LookupGroupKey.CustomerType,"AGENT","Agent",3),
            });

            // --- SalesType
            list.AddRange(new[]
            {
                L(LookupGroupKey.SalesType,"WALK_IN","Walk In",1),
                L(LookupGroupKey.SalesType,"POSTAGE","Postage",2),
                L(LookupGroupKey.SalesType,"COD","COD",3),
                L(LookupGroupKey.SalesType,"LALAMOVE","Lalamove",4),
            });

            // --- PaymentType
            list.AddRange(new[]
            {
                L(LookupGroupKey.PaymentType,"CASH","Cash",1),
                L(LookupGroupKey.PaymentType,"TRANSFER","Transfer",2),
                L(LookupGroupKey.PaymentType,"CHEQUE","Cheque",3),
                L(LookupGroupKey.PaymentType,"CARD","Master/Visa/Credit Card",4),
                L(LookupGroupKey.PaymentType,"CARD_PLUS_TRANSFER","Card + Transfer",5),
                L(LookupGroupKey.PaymentType,"CARD_PLUS_CASH","Card + Cash",6),
                L(LookupGroupKey.PaymentType,"CASH_PLUS_TRANSFER","Cash + Transfer",7),
                L(LookupGroupKey.PaymentType,"TRADE_IN_SWAP","Trade in (Swap)",8),
                L(LookupGroupKey.PaymentType,"TRADE_IN","Trade in",9),
                L(LookupGroupKey.PaymentType,"WRONG_KEY_IN","Wrong Key in",98),
                L(LookupGroupKey.PaymentType,"DOUBLE_ENTRY","Double_Entry",99),
            });

            // --- Location (isSellable in meta)
            list.AddRange(new[]
            {
                L(LookupGroupKey.Location,"STOCK","STOCK",1,               "{\"isSellable\":true}"),
                L(LookupGroupKey.Location,"MISSING","MISSING",2,           "{\"isSellable\":false}"),
                L(LookupGroupKey.Location,"DAMAGED_GOODS","DAMAGED GOODS",3,"{\"isSellable\":false}"),
                L(LookupGroupKey.Location,"REFUND","REFUND",4,             "{\"isSellable\":false}"),
                L(LookupGroupKey.Location,"OUTSOURCE","OUTSOURCE",5,       "{\"isSellable\":false}"),
                L(LookupGroupKey.Location,"OUTSOURCE_REPAIR","OUTSOURCE_REPAIR",6,"{\"isSellable\":false}"),
                L(LookupGroupKey.Location,"IMTIAZ","IMTIAZ",7,             "{\"isSellable\":true}"),
                L(LookupGroupKey.Location,"BALI","BALI",8,                 "{\"isSellable\":true}"),
                L(LookupGroupKey.Location,"CLAIM","CLAIM",9,               "{\"isSellable\":false}"),
            });

            // --- Region / Condition
            list.Add(L(LookupGroupKey.Region, "MY/A", "MY/A", 1));
            list.Add(L(LookupGroupKey.NewOrUsed, "NEW", "NEW", 1));
            list.Add(L(LookupGroupKey.NewOrUsed, "USED", "USED", 2));

            // --- Inventory Status
            list.AddRange(new[]
            {
                L(LookupGroupKey.InventoryStatus,"IN_STOCK","In Stock",1),
                L(LookupGroupKey.InventoryStatus,"RESERVED","Reserved",2),
                L(LookupGroupKey.InventoryStatus,"SOLD","Sold",3),
                L(LookupGroupKey.InventoryStatus,"MISSING","Missing",4),
                L(LookupGroupKey.InventoryStatus,"DAMAGED","Damaged",5),
                L(LookupGroupKey.InventoryStatus,"OUTSOURCE","Outsource",6),
                L(LookupGroupKey.InventoryStatus,"REFUND","Refund",7),
            });

            // --- Product Category
            list.AddRange(new[]
            {
                L(LookupGroupKey.ProductCategory,"PHONE","Phone",1),
                L(LookupGroupKey.ProductCategory,"LAPTOP","Laptop",2),
                L(LookupGroupKey.ProductCategory,"ACCESSORY","Accessory",3),
                L(LookupGroupKey.ProductCategory,"SERVICE","Service",4),
            });

            // --- Expense Category
            list.AddRange(new[]
            {
                L(LookupGroupKey.ExpenseCategory,"INTERNET_TELEPHONE","Internet and Telephone",1),
                L(LookupGroupKey.ExpenseCategory,"FREIGHT","Freight",2),
                L(LookupGroupKey.ExpenseCategory,"SOFTWARE","Software",3),
                L(LookupGroupKey.ExpenseCategory,"STAFF_REFRESHMENT","Staff Refreshment",4),
                L(LookupGroupKey.ExpenseCategory,"ADVERTISING","Advertising",5),
                L(LookupGroupKey.ExpenseCategory,"TAX","Tax",6),
                L(LookupGroupKey.ExpenseCategory,"PART_AND_ACCESSORIES","Part and Accessories",7),
                L(LookupGroupKey.ExpenseCategory,"OUTSOURCING_REPAIR","Outsourcing Repair",8),
            });

            // --- ScreenSize
            string[] sizes = { "4.7", "5.0", "5.5", "6.1", "6.4", "6.5", "6.7", "7", "8", "10.2", "11", "12.9", "13.3", "14", "15.6" };
            for (int i = 0; i < sizes.Length; i++)
                list.Add(L(LookupGroupKey.ScreenSize, sizes[i].Replace('.', '_') + "IN", $"{sizes[i]}\"", i + 1));

            // --- Color
            string[] colors = { "Black", "White", "Silver", "Grey", "Space Gray", "Blue", "Gold", "Green", "Red", "Purple", "Pink" };
            for (int i = 0; i < colors.Length; i++)
                list.Add(L(LookupGroupKey.Color, colors[i].ToUpper().Replace(" ", "_"), colors[i], i + 1));

            // --- Storage
            foreach (var cap in new[] { "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB" })
                list.Add(L(LookupGroupKey.Storage, cap, cap, list.Count));

            // --- Ram
            foreach (var cap in new[] { "2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB", "24GB", "32GB", "64GB" })
                list.Add(L(LookupGroupKey.Ram, cap, cap, list.Count));
 

            return list;
        }
    }
}
