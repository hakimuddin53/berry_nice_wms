using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_InventoryBalances_CurrentLocationId",
                table: "InventoryBalances",
                column: "CurrentLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryBalances_ProductId_WarehouseId_Quantity",
                table: "InventoryBalances",
                columns: new[] { "ProductId", "WarehouseId", "Quantity" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_InventoryBalances_CurrentLocationId",
                table: "InventoryBalances");

            migrationBuilder.DropIndex(
                name: "IX_InventoryBalances_ProductId_WarehouseId_Quantity",
                table: "InventoryBalances");
        }
    }
}
