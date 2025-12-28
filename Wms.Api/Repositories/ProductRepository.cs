using System.Threading.Tasks;
using Wms.Api.Entities;
using Wms.Api.Context;
using Microsoft.EntityFrameworkCore;
using DocumentFormat.OpenXml.InkML;

namespace Wms.Api.Repositories
{
    public class ProductRepository(ApplicationDbContext dbContext) : IProductRepository
    {
        public async Task AddProductAsync(Product product, bool saveChanges = false)
        {
            dbContext.Products.Add(product);
            if (saveChanges)
            {
                await dbContext.SaveChangesAsync();
            }
        }

        public async Task AddProductsAsync(IEnumerable<Product> products)
        {
            if (products != null)             
                await dbContext.Products.AddRangeAsync(products);
            else
                throw new ArgumentNullException(nameof(products));
        }

        public async Task SaveChangesAsync()
        {
              await dbContext.SaveChangesAsync();             
        }

        //public async Task<Guid> GetOrCreateCategoryIdAsync(string categoryName)
        //{
        //    var category = await dbContext.Categories.FirstOrDefaultAsync(c => c.Name == categoryName);
        //    if (category == null)
        //    {
        //        category = new Category { Id = Guid.NewGuid(), Name = categoryName };
        //        dbContext.Categories.Add(category);
        //    }
        //    return category.Id;
        //}

        //public async Task<Guid> GetOrCreateSizeIdAsync(string sizeName)
        //{
        //    var size = await dbContext.Sizes.FirstOrDefaultAsync(s => s.Name == sizeName);
        //    if (size == null)
        //    {
        //        size = new Size { Id = Guid.NewGuid(), Name = sizeName };
        //        dbContext.Sizes.Add(size);
        //    }
        //    return size.Id;
        //}

        //public async Task<Guid> GetOrCreateColourIdAsync(string colourName)
        //{
        //    var colour = await dbContext.Colours.FirstOrDefaultAsync(c => c.Name == colourName);
        //    if (colour == null)
        //    {
        //        colour = new Colour { Id = Guid.NewGuid(), Name = colourName };
        //        dbContext.Colours.Add(colour);
        //    }
        //    return colour.Id;
        //}

        //public async Task<Guid> GetOrCreateDesignIdAsync(string designName)
        //{
        //    var design = await dbContext.Designs.FirstOrDefaultAsync(d => d.Name == designName);
        //    if (design == null)
        //    {
        //        design = new Design { Id = Guid.NewGuid(), Name = designName };
        //        dbContext.Designs.Add(design);
        //    }
        //    return design.Id;
        //}

        //public async Task<Guid> GetOrCreateCartonSizeIdAsync(string cartonSizeName)
        //{
        //    var cartonSize = await dbContext.CartonSizes.FirstOrDefaultAsync(c => c.Name == cartonSizeName);
        //    if (cartonSize == null)
        //    {
        //        cartonSize = new CartonSize { Id = Guid.NewGuid(), Name = cartonSizeName };
        //        dbContext.CartonSizes.Add(cartonSize);
        //    }
        //    return cartonSize.Id;
        //}

        //public async Task<Guid> GetOrCreateRackIdAsync(string rackName)
        //{
        //    var rack = await dbContext.Locations.FirstOrDefaultAsync(c => c.Name == rackName);
        //    if (rack == null)
        //    {
        //        rack = new Location { Id = Guid.NewGuid(), Name = rackName };
        //        dbContext.Locations.Add(rack);
        //    }
        //    return rack.Id;
        //}
        
        //public async Task<Guid> GetOrCreateClientCodeIdAsync(string clientCodeName)
        //{
        //    var clientCode = await dbContext.ClientCodes.FirstOrDefaultAsync(c => c.Name == clientCodeName);
        //    if (clientCode == null)
        //    {
        //        clientCode = new ClientCode { Id = Guid.NewGuid(), Name = clientCodeName };
        //        dbContext.ClientCodes.Add(clientCode);
        //    }
        //    return clientCode.Id;
        //}
        
        public Task<Product?> GetProductByAllCriteriaAsync(
            string itemCode,
            Guid clientCodeId, 
            Guid cartonSizeId,
            Guid categoryId,
            Guid colourId,
            Guid designId,
            Guid sizeId)
        {
            // Since Product entity has changed to use string lookups instead of Guid references,
            // this method is no longer applicable. Return null.
            return Task.FromResult<Product?>(null);
        }

        public async Task<Product?> GetProductByItemCodeAsync(string itemCode)
        {
            return await dbContext.Products.FirstOrDefaultAsync(p => p.ProductCode == itemCode);
        }

        //public async Task<Guid> GetOrCreateWarehouseIdAsync(string warehouseName)
        //{
        //    var warehouse = await dbContext.Warehouses.FirstOrDefaultAsync(c => c.Name == warehouseName);
        //    if (warehouse == null)
        //    {
        //        warehouse = new Warehouse { Id = Guid.NewGuid(), Name = warehouseName };
        //        dbContext.Warehouses.Add(warehouse);
        //    }
        //    return warehouse.Id;
        //}

        public async Task<Product?> GetProductByIdWithLookupsAsync(Guid productId)
        {
            return await dbContext.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Model)
                .Include(p => p.Color)
                .Include(p => p.Storage)
                .Include(p => p.Ram)
                .Include(p => p.Processor)
                .Include(p => p.ScreenSize)
                .Include(p => p.Grade)
                .FirstOrDefaultAsync(p => p.ProductId == productId);
        }

        public async Task AddInventoryRecordAsync(Inventory inventory)
        {
            await dbContext.Inventories.AddAsync(inventory); 
        }
    }
}
