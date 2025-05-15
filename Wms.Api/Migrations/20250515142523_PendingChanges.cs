using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class PendingChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromLocation",
                table: "StockTransferItems");

            migrationBuilder.DropColumn(
                name: "FromWarehouse",
                table: "StockTransferItems");

            migrationBuilder.DropColumn(
                name: "Product",
                table: "StockTransferItems");

            migrationBuilder.DropColumn(
                name: "ToLocation",
                table: "StockTransferItems");

            migrationBuilder.DropColumn(
                name: "ToWarehouse",
                table: "StockTransferItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FromLocation",
                table: "StockTransferItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FromWarehouse",
                table: "StockTransferItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Product",
                table: "StockTransferItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ToLocation",
                table: "StockTransferItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ToWarehouse",
                table: "StockTransferItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
