using System.Threading.Tasks;
using Wms.Api.Entities;
using Wms.Api.Context;
using Microsoft.EntityFrameworkCore;

namespace Wms.Api.Repositories
{
    public class ProductRepository(ApplicationDbContext dbContext) : IProductRepository
    {
        private readonly ApplicationDbContext _dbContext = dbContext;

        public async Task AddProductAsync(Product product, bool saveChanges = false)
        {
            _dbContext.Products.Add(product);
            if (saveChanges)
            {
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task SaveChangesAsync()
        {
              await _dbContext.SaveChangesAsync();             
        }

        public async Task<Guid> GetOrCreateCategoryIdAsync(string categoryName)
        {
            var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Name == categoryName);
            if (category == null)
            {
                category = new Category { Id = Guid.NewGuid(), Name = categoryName };
                _dbContext.Categories.Add(category);
            }
            return category.Id;
        }

        public async Task<Guid> GetOrCreateSizeIdAsync(string sizeName)
        {
            var size = await _dbContext.Sizes.FirstOrDefaultAsync(s => s.Name == sizeName);
            if (size == null)
            {
                size = new Size { Id = Guid.NewGuid(), Name = sizeName };
                _dbContext.Sizes.Add(size);
            }
            return size.Id;
        }

        public async Task<Guid> GetOrCreateColourIdAsync(string colourName)
        {
            var colour = await _dbContext.Colours.FirstOrDefaultAsync(c => c.Name == colourName);
            if (colour == null)
            {
                colour = new Colour { Id = Guid.NewGuid(), Name = colourName };
                _dbContext.Colours.Add(colour);
            }
            return colour.Id;
        }

        public async Task<Guid> GetOrCreateDesignIdAsync(string designName)
        {
            var design = await _dbContext.Designs.FirstOrDefaultAsync(d => d.Name == designName);
            if (design == null)
            {
                design = new Design { Id = Guid.NewGuid(), Name = designName };
                _dbContext.Designs.Add(design);
            }
            return design.Id;
        }

        public async Task<Guid> GetOrCreateCartonSizeIdAsync(string cartonSizeName)
        {
            var cartonSize = await _dbContext.CartonSizes.FirstOrDefaultAsync(c => c.Name == cartonSizeName);
            if (cartonSize == null)
            {
                cartonSize = new CartonSize { Id = Guid.NewGuid(), Name = cartonSizeName };
                _dbContext.CartonSizes.Add(cartonSize);
            }
            return cartonSize.Id;
        }

        public async Task<Guid> GetOrCreateRackIdAsync(string rackName)
        {
            var rack = await _dbContext.Locations.FirstOrDefaultAsync(c => c.Name == rackName);
            if (rack == null)
            {
                rack = new Location { Id = Guid.NewGuid(), Name = rackName };
                _dbContext.Locations.Add(rack);
            }
            return rack.Id;
        }

        public async Task<Product?> GetProductByItemCodeAsync(string itemCode)
        {
            return await _dbContext.Products.FirstOrDefaultAsync(p => p.ItemCode == itemCode);
        }

        public async Task<Guid> GetFirstWarehouseIdAsync()
        {
            var warehouse = await _dbContext.Warehouses.FirstOrDefaultAsync();
            if (warehouse == null)
                throw new Exception("No warehouse found in the database.");
            return warehouse.Id;
        }

        public async Task AddInventoryRecordAsync(Inventory inventory)
        {
            await _dbContext.Inventories.AddAsync(inventory); 
        }
    }
}