using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveProductIdFromStockInItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BrandId",
                table: "StockInItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "StockInItems",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: Guid.Empty);

            migrationBuilder.AddColumn<Guid>(
                name: "ColorId",
                table: "StockInItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Model",
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
                defaultValue: string.Empty);

            migrationBuilder.AddColumn<Guid>(
                name: "RamId",
                table: "StockInItems",
                type: "uniqueidentifier",
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

            migrationBuilder.DropForeignKey(
                name: "FK_StockInItems_Products_ProductId",
                table: "StockInItems");

            migrationBuilder.DropIndex(
                name: "IX_StockInItems_ProductId",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "StockInItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BrandId",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "ColorId",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "Model",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "ProcessorId",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "ProductCode",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "RamId",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "ScreenSizeId",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "StorageId",
                table: "StockInItems");

            migrationBuilder.AddColumn<Guid>(
                name: "ProductId",
                table: "StockInItems",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: Guid.Empty);

            migrationBuilder.CreateIndex(
                name: "IX_StockInItems_ProductId",
                table: "StockInItems",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_StockInItems_Products_ProductId",
                table: "StockInItems",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
