using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class modifytable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RunningDocumentNumber",
                table: "StockOuts");

            migrationBuilder.DropColumn(
                name: "RunningDocumentNumber",
                table: "StockIns");

            migrationBuilder.DropColumn(
                name: "WarehouseCode",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "Warehouse",
                table: "StockOuts",
                newName: "Number");

            migrationBuilder.RenameColumn(
                name: "Warehouse",
                table: "StockIns",
                newName: "Number");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "StockIns",
                newName: "CreatedAt");

            migrationBuilder.AddColumn<DateTime>(
                name: "ChangedAt",
                table: "StockOuts",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ChangedById",
                table: "StockOuts",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "StockOuts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "StockOuts",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "WarehouseId",
                table: "StockOuts",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "ChangedAt",
                table: "StockOutDetails",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ChangedById",
                table: "StockOutDetails",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "StockOutDetails",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "StockOutDetails",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "StockOutItemNumber",
                table: "StockOutDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ChangedAt",
                table: "StockIns",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ChangedById",
                table: "StockIns",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "StockIns",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "WarehouseId",
                table: "StockIns",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "ChangedAt",
                table: "StockInDetails",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ChangedById",
                table: "StockInDetails",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "StockInDetails",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "StockInDetails",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "StockInItemNumber",
                table: "StockInDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ChangedAt",
                table: "ProductUoms",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ChangedById",
                table: "ProductUoms",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "ProductUoms",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "ProductUoms",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "ChangedAt",
                table: "Products",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ChangedById",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Products",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "Products",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "WarehouseId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "ChangedAt",
                table: "Location",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ChangedById",
                table: "Location",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Location",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "Location",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChangedAt",
                table: "StockOuts");

            migrationBuilder.DropColumn(
                name: "ChangedById",
                table: "StockOuts");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "StockOuts");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "StockOuts");

            migrationBuilder.DropColumn(
                name: "WarehouseId",
                table: "StockOuts");

            migrationBuilder.DropColumn(
                name: "ChangedAt",
                table: "StockOutDetails");

            migrationBuilder.DropColumn(
                name: "ChangedById",
                table: "StockOutDetails");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "StockOutDetails");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "StockOutDetails");

            migrationBuilder.DropColumn(
                name: "StockOutItemNumber",
                table: "StockOutDetails");

            migrationBuilder.DropColumn(
                name: "ChangedAt",
                table: "StockIns");

            migrationBuilder.DropColumn(
                name: "ChangedById",
                table: "StockIns");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "StockIns");

            migrationBuilder.DropColumn(
                name: "WarehouseId",
                table: "StockIns");

            migrationBuilder.DropColumn(
                name: "ChangedAt",
                table: "StockInDetails");

            migrationBuilder.DropColumn(
                name: "ChangedById",
                table: "StockInDetails");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "StockInDetails");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "StockInDetails");

            migrationBuilder.DropColumn(
                name: "StockInItemNumber",
                table: "StockInDetails");

            migrationBuilder.DropColumn(
                name: "ChangedAt",
                table: "ProductUoms");

            migrationBuilder.DropColumn(
                name: "ChangedById",
                table: "ProductUoms");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "ProductUoms");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "ProductUoms");

            migrationBuilder.DropColumn(
                name: "ChangedAt",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ChangedById",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "WarehouseId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ChangedAt",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "ChangedById",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Location");

            migrationBuilder.RenameColumn(
                name: "Number",
                table: "StockOuts",
                newName: "Warehouse");

            migrationBuilder.RenameColumn(
                name: "Number",
                table: "StockIns",
                newName: "Warehouse");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "StockIns",
                newName: "Date");

            migrationBuilder.AddColumn<string>(
                name: "RunningDocumentNumber",
                table: "StockOuts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RunningDocumentNumber",
                table: "StockIns",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "WarehouseCode",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
