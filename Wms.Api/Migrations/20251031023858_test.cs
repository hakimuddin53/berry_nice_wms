using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class test : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // drop stock out tables if they exist
            migrationBuilder.Sql(@"IF OBJECT_ID(N'[StockOutItems]', 'U') IS NOT NULL DROP TABLE [StockOutItems];");
            migrationBuilder.Sql(@"IF OBJECT_ID(N'[StockOuts]', 'U') IS NOT NULL DROP TABLE [StockOuts];");

            // drop columns from StockInItems if they exist
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'AgentSellingPrice' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [AgentSellingPrice]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'BrandId' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [BrandId]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'ColorId' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [ColorId]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'Condition' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [Condition]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'Cost' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [Cost]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'DealerSellingPrice' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [DealerSellingPrice]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'ItemsIncluded' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [ItemsIncluded]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'ManufactureSerialNumber' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [ManufactureSerialNumber]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'Model' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [Model]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'PrimarySerialNumber' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [PrimarySerialNumber]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'ProcessorId' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [ProcessorId]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'ProductCode' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [ProductCode]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'RamId' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [RamId]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'Region' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [Region]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'RetailSellingPrice' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [RetailSellingPrice]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'ScreenSizeId' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [ScreenSizeId]; END");
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'StorageId' AND Object_ID = Object_ID(N'StockInItems')) BEGIN ALTER TABLE [StockInItems] DROP COLUMN [StorageId]; END");

            // drop Remark column from StockInItemRemarks if exists
            migrationBuilder.Sql(@"IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'Remark' AND Object_ID = Object_ID(N'StockInItemRemarks')) BEGIN ALTER TABLE [StockInItemRemarks] DROP COLUMN [Remark]; END");

            // drop any default constraint on StockOutId and then drop StockOutId from Inventories if it exists
            migrationBuilder.Sql(@"
DECLARE @dc nvarchar(128);
SELECT @dc = dc.name FROM sys.default_constraints dc
JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'Inventories' AND c.name = 'StockOutId';
IF @dc IS NOT NULL EXEC('ALTER TABLE [Inventories] DROP CONSTRAINT [' + @dc + ']');
IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'StockOutId' AND Object_ID = Object_ID(N'Inventories')) BEGIN ALTER TABLE [Inventories] DROP COLUMN [StockOutId]; END
");

            // rename CategoryId -> ProductId only if CategoryId exists and ProductId does not
            migrationBuilder.Sql(@"
IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'CategoryId' AND Object_ID = Object_ID(N'StockInItems'))
    AND NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'ProductId' AND Object_ID = Object_ID(N'StockInItems'))
BEGIN
    EXEC('EXEC sp_rename N''[StockInItems].[CategoryId]'', N''ProductId'', ''COLUMN'';');
END");

            // add ProductRemarkId to StockInItemRemarks if not exists
            migrationBuilder.Sql(@"IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'ProductRemarkId' AND Object_ID = Object_ID(N'StockInItemRemarks')) BEGIN ALTER TABLE [StockInItemRemarks] ADD [ProductRemarkId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'; END");

            // add product columns only if they do not already exist
            migrationBuilder.Sql(@"IF COL_LENGTH('Products','AgentPrice') IS NULL BEGIN ALTER TABLE [Products] ADD [AgentPrice] decimal(18,4) NULL; END");
            migrationBuilder.Sql(@"IF COL_LENGTH('Products','CostPrice') IS NULL BEGIN ALTER TABLE [Products] ADD [CostPrice] decimal(18,4) NULL; END");
            migrationBuilder.Sql(@"IF COL_LENGTH('Products','DealerPrice') IS NULL BEGIN ALTER TABLE [Products] ADD [DealerPrice] decimal(18,4) NULL; END");
            migrationBuilder.Sql(@"IF COL_LENGTH('Products','ManufactureSerialNumber') IS NULL BEGIN ALTER TABLE [Products] ADD [ManufactureSerialNumber] nvarchar(max) NULL; END");
            migrationBuilder.Sql(@"IF COL_LENGTH('Products','NewOrUsed') IS NULL BEGIN ALTER TABLE [Products] ADD [NewOrUsed] nvarchar(max) NULL; END");
            migrationBuilder.Sql(@"IF COL_LENGTH('Products','PrimarySerialNumber') IS NULL BEGIN ALTER TABLE [Products] ADD [PrimarySerialNumber] nvarchar(max) NULL; END");
            migrationBuilder.Sql(@"IF COL_LENGTH('Products','Region') IS NULL BEGIN ALTER TABLE [Products] ADD [Region] nvarchar(max) NULL; END");
            migrationBuilder.Sql(@"IF COL_LENGTH('Products','RetailPrice') IS NULL BEGIN ALTER TABLE [Products] ADD [RetailPrice] decimal(18,4) NULL; END");

            // create ProductRemarks table only if it doesn't exist
            migrationBuilder.Sql(@"IF OBJECT_ID(N'[ProductRemarks]', 'U') IS NULL BEGIN
    CREATE TABLE [ProductRemarks] (
        [Id] uniqueidentifier NOT NULL,
        [ProductId] uniqueidentifier NOT NULL,
        [Remark] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [CreatedById] uniqueidentifier NOT NULL,
        [ChangedAt] datetime2 NULL,
        [ChangedById] uniqueidentifier NULL,
        CONSTRAINT [PK_ProductRemarks] PRIMARY KEY ([Id])
    );
    ALTER TABLE [ProductRemarks] ADD CONSTRAINT [FK_ProductRemarks_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products]([ProductId]) ON DELETE CASCADE;
END");

            // create indexes if not exist
            migrationBuilder.Sql(@"IF NOT EXISTS(SELECT * FROM sys.indexes WHERE name = N'IX_StockInItems_ProductId' AND object_id = OBJECT_ID(N'StockInItems')) CREATE INDEX [IX_StockInItems_ProductId] ON [StockInItems]([ProductId]);");
            migrationBuilder.Sql(@"IF NOT EXISTS(SELECT * FROM sys.indexes WHERE name = N'IX_StockInItemRemarks_ProductRemarkId' AND object_id = OBJECT_ID(N'StockInItemRemarks')) CREATE INDEX [IX_StockInItemRemarks_ProductRemarkId] ON [StockInItemRemarks]([ProductRemarkId]);");
            migrationBuilder.Sql(@"IF NOT EXISTS(SELECT * FROM sys.indexes WHERE name = N'IX_ProductRemarks_ProductId' AND object_id = OBJECT_ID(N'ProductRemarks')) CREATE INDEX [IX_ProductRemarks_ProductId] ON [ProductRemarks]([ProductId]);");

            // add foreign keys if not exist
            migrationBuilder.Sql(@"IF NOT EXISTS(SELECT * FROM sys.foreign_keys WHERE name = N'FK_StockInItemRemarks_ProductRemarks_ProductRemarkId') ALTER TABLE [StockInItemRemarks] ADD CONSTRAINT [FK_StockInItemRemarks_ProductRemarks_ProductRemarkId] FOREIGN KEY ([ProductRemarkId]) REFERENCES [ProductRemarks]([Id]) ON DELETE NO ACTION;");
            migrationBuilder.Sql(@"IF NOT EXISTS(SELECT * FROM sys.foreign_keys WHERE name = N'FK_StockInItems_Products_ProductId') ALTER TABLE [StockInItems] ADD CONSTRAINT [FK_StockInItems_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products]([ProductId]) ON DELETE NO ACTION;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockInItemRemarks_ProductRemarks_ProductRemarkId",
                table: "StockInItemRemarks");

            migrationBuilder.DropForeignKey(
                name: "FK_StockInItems_Products_ProductId",
                table: "StockInItems");

            migrationBuilder.DropTable(
                name: "ProductRemarks");

            migrationBuilder.DropIndex(
                name: "IX_StockInItems_ProductId",
                table: "StockInItems");

            migrationBuilder.DropIndex(
                name: "IX_StockInItemRemarks_ProductRemarkId",
                table: "StockInItemRemarks");

            migrationBuilder.DropColumn(
                name: "ProductRemarkId",
                table: "StockInItemRemarks");

            migrationBuilder.DropColumn(
                name: "AgentPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CostPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "DealerPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ManufactureSerialNumber",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "NewOrUsed",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "PrimarySerialNumber",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "RetailPrice",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "StockInItems",
                newName: "CategoryId");

            migrationBuilder.AddColumn<decimal>(
                name: "AgentSellingPrice",
                table: "StockInItems",
                type: "decimal(18,4)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "BrandId",
                table: "StockInItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ColorId",
                table: "StockInItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Condition",
                table: "StockInItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Cost",
                table: "StockInItems",
                type: "decimal(18,4)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DealerSellingPrice",
                table: "StockInItems",
                type: "decimal(18,4)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ItemsIncluded",
                table: "StockInItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ManufactureSerialNumber",
                table: "StockInItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Model",
                table: "StockInItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimarySerialNumber",
                table: "StockInItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ProcessorId",
                table: "StockInItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProductCode",
                table: "StockInItems",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "RamId",
                table: "StockInItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "StockInItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RetailSellingPrice",
                table: "StockInItems",
                type: "decimal(18,4)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ScreenSizeId",
                table: "StockInItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "StorageId",
                table: "StockInItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Remark",
                table: "StockInItemRemarks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "StockOutId",
                table: "Inventories",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "StockOuts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChangedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DONumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Number = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SONumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ToLocation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WarehouseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockOuts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StockOutItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChangedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LocationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    StockOutId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockOutItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockOutItems_StockOuts_StockOutId",
                        column: x => x.StockOutId,
                        principalTable: "StockOuts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockOutItems_StockOutId",
                table: "StockOutItems",
                column: "StockOutId");
        }
    }
}
