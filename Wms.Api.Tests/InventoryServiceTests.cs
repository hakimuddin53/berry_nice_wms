using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Tests;

public class InventoryServiceTests
{
    [Fact]
    public async Task StockTake_WithKnownProduct_PersistsCountsAndDifference()
    {
        using var connection = CreateOpenConnection();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlite(connection)
            .Options;

        using var context = new ApplicationDbContext(options, new FakeCurrentUserService());
        context.Database.EnsureCreated();

        var warehouseId = Guid.NewGuid();
        var productId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();

        context.Lookups.Add(new Lookup
        {
            Id = categoryId,
            GroupKey = LookupGroupKey.ProductCategory,
            Code = "CAT",
            Label = "Category",
            SortOrder = 1
        });

        context.Products.Add(new Product
        {
            ProductId = productId,
            ProductCode = "PROD-001",
            CategoryId = categoryId,
            LocationId = Guid.NewGuid()
        });
        await context.SaveChangesAsync();

        var service = new InventoryService(context, new RunningNumberService(context));

        var request = new StockTakeRequest
        {
            WarehouseId = warehouseId,
            Items = new List<StockTakeItemRequest>
            {
                new()
                {
                    ProductId = productId,
                    CountedQuantity = 2
                }
            }
        };

        var created = await service.StockTakeAsync(request);

        var saved = await context.StockTakes
            .Include(st => st.Items)
            .FirstAsync(st => st.Id == created.Id);

        saved.Items.Should().HaveCount(1);
        var item = saved.Items.Single();
        item.ProductId.Should().Be(productId);
        item.CountedQuantity.Should().Be(2);
        item.SystemQuantity.Should().Be(0);
        item.DifferenceQuantity.Should().Be(2);
        item.ScannedBarcode.Should().BeNull();
    }

    [Fact]
    public async Task StockTake_WithUnknownBarcode_PersistsScannedBarcode()
    {
        using var connection = CreateOpenConnection();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlite(connection)
            .Options;

        using var context = new ApplicationDbContext(options, new FakeCurrentUserService());
        context.Database.EnsureCreated();

        var warehouseId = Guid.NewGuid();
        var service = new InventoryService(context, new RunningNumberService(context));

        var request = new StockTakeRequest
        {
            WarehouseId = warehouseId,
            Items = new List<StockTakeItemRequest>
            {
                new()
                {
                    ProductId = null,
                    ScannedBarcode = "MISSING-001",
                    CountedQuantity = 1
                }
            }
        };

        var created = await service.StockTakeAsync(request);

        var saved = await context.StockTakes
            .Include(st => st.Items)
            .FirstAsync(st => st.Id == created.Id);

        saved.Items.Should().HaveCount(1);
        var item = saved.Items.Single();
        item.ProductId.Should().BeNull();
        item.ScannedBarcode.Should().Be("MISSING-001");
        item.CountedQuantity.Should().Be(1);
        item.SystemQuantity.Should().Be(0);
        item.DifferenceQuantity.Should().Be(1);
    }

    private static SqliteConnection CreateOpenConnection()
    {
        var connection = new SqliteConnection("DataSource=:memory:");
        connection.Open();
        return connection;
    }
}

public class FakeCurrentUserService : ICurrentUserService
{
    public string UserId() => Guid.Empty.ToString();
}
