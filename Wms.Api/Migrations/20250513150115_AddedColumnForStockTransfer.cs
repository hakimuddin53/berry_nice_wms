using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddedColumnForStockTransfer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FromLocation",
                table: "StockTransferItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "FromLocationId",
                table: "StockTransferItems",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "ToLocation",
                table: "StockTransferItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "ToLocationId",
                table: "StockTransferItems",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromLocation",
                table: "StockTransferItems");

            migrationBuilder.DropColumn(
                name: "FromLocationId",
                table: "StockTransferItems");

            migrationBuilder.DropColumn(
                name: "ToLocation",
                table: "StockTransferItems");

            migrationBuilder.DropColumn(
                name: "ToLocationId",
                table: "StockTransferItems");
        }
    }
}
