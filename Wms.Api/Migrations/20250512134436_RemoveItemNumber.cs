using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveItemNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StockTransferItemNumber",
                table: "StockTransferItems");

            migrationBuilder.DropColumn(
                name: "StockReservationItemNumber",
                table: "StockReservationItems");

            migrationBuilder.DropColumn(
                name: "StockOutItemNumber",
                table: "StockOutItems");

            migrationBuilder.DropColumn(
                name: "StockInItemNumber",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "StockAdjustmentItemNumber",
                table: "StockAdjustmentItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StockTransferItemNumber",
                table: "StockTransferItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StockReservationItemNumber",
                table: "StockReservationItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StockOutItemNumber",
                table: "StockOutItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StockInItemNumber",
                table: "StockInItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StockAdjustmentItemNumber",
                table: "StockAdjustmentItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
