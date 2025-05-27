using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddInventoryBalance001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InventoryBalances",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WarehouseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CurrentLocationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryBalances", x => x.Id);
                });

            // 2. Add indexes for lookup efficiency (optional)
            migrationBuilder.CreateIndex(
                name: "IX_InventoryBalances_Product_Warehouse_Location",
                table: "InventoryBalances",
                columns: new[] { "ProductId", "WarehouseId", "CurrentLocationId" },
                unique: true);

            // Insert initial data with latest NewBalance from Inventories table per ProductId, WarehouseId, CurrentLocationId
            migrationBuilder.Sql(@"
                    INSERT INTO InventoryBalances (Id, ProductId, WarehouseId, CurrentLocationId, Quantity)
                    SELECT NEWID(), ProductId, WarehouseId, CurrentLocationId, NewBalance
                    FROM (
                        SELECT 
                            ProductId, WarehouseId, CurrentLocationId, NewBalance,
                            ROW_NUMBER() OVER (PARTITION BY ProductId, WarehouseId, CurrentLocationId ORDER BY CreatedAt DESC) AS rn
                        FROM Inventories
                    ) AS latest
                    WHERE rn = 1
                ");


        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InventoryBalances");
        }
    }
}
