using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStockInEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "StockInItems");

            migrationBuilder.RenameColumn(
                name: "PONumber",
                table: "StockIns",
                newName: "SellerInfo");

            migrationBuilder.RenameColumn(
                name: "JSNumber",
                table: "StockIns",
                newName: "Purchaser");

            migrationBuilder.RenameColumn(
                name: "FromLocation",
                table: "StockIns",
                newName: "Location");

            migrationBuilder.RenameColumn(
                name: "Quantity",
                table: "StockInItems",
                newName: "ReceiveQuantity");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfPurchase",
                table: "StockIns",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "AgentSellingPrice",
                table: "StockInItems",
                type: "decimal(18,4)",
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
                name: "PrimarySerialNumber",
                table: "StockInItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "StockInItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "StockInItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RetailSellingPrice",
                table: "StockInItems",
                type: "decimal(18,4)",
                nullable: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockInItems_Products_ProductId",
                table: "StockInItems");

            migrationBuilder.DropIndex(
                name: "IX_StockInItems_ProductId",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "DateOfPurchase",
                table: "StockIns");

            migrationBuilder.DropColumn(
                name: "AgentSellingPrice",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "Condition",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "Cost",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "DealerSellingPrice",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "ItemsIncluded",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "ManufactureSerialNumber",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "PrimarySerialNumber",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "RetailSellingPrice",
                table: "StockInItems");

            migrationBuilder.RenameColumn(
                name: "SellerInfo",
                table: "StockIns",
                newName: "PONumber");

            migrationBuilder.RenameColumn(
                name: "Purchaser",
                table: "StockIns",
                newName: "JSNumber");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "StockIns",
                newName: "FromLocation");

            migrationBuilder.RenameColumn(
                name: "ReceiveQuantity",
                table: "StockInItems",
                newName: "Quantity");

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "StockInItems",
                type: "decimal(18,4)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
