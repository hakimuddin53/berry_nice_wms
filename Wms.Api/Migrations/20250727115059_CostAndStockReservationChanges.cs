using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class CostAndStockReservationChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpirationDate",
                table: "StockReservationItems");

            migrationBuilder.DropColumn(
                name: "ReservationDate",
                table: "StockReservationItems");

            migrationBuilder.AddColumn<DateTime>(
                name: "CancellationApprovedAt",
                table: "StockReservations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CancellationApprovedBy",
                table: "StockReservations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CancellationRemark",
                table: "StockReservations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CancellationRequestedAt",
                table: "StockReservations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CancellationRequestedBy",
                table: "StockReservations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiresAt",
                table: "StockReservations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ReservedAt",
                table: "StockReservations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "StockReservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "WarehouseId",
                table: "StockReservations",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "StockInItems",
                type: "decimal(18,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "WarehouseInventoryBalances",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WarehouseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OnHandQuantity = table.Column<int>(type: "int", nullable: false),
                    ReservedQuantity = table.Column<int>(type: "int", nullable: false),
                    TotalQtyReceived = table.Column<int>(type: "int", nullable: false),
                    TotalCostAccumulated = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChangedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WarehouseInventoryBalances", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WarehouseInventoryBalances");

            migrationBuilder.DropColumn(
                name: "CancellationApprovedAt",
                table: "StockReservations");

            migrationBuilder.DropColumn(
                name: "CancellationApprovedBy",
                table: "StockReservations");

            migrationBuilder.DropColumn(
                name: "CancellationRemark",
                table: "StockReservations");

            migrationBuilder.DropColumn(
                name: "CancellationRequestedAt",
                table: "StockReservations");

            migrationBuilder.DropColumn(
                name: "CancellationRequestedBy",
                table: "StockReservations");

            migrationBuilder.DropColumn(
                name: "ExpiresAt",
                table: "StockReservations");

            migrationBuilder.DropColumn(
                name: "ReservedAt",
                table: "StockReservations");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "StockReservations");

            migrationBuilder.DropColumn(
                name: "WarehouseId",
                table: "StockReservations");

            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "StockInItems");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpirationDate",
                table: "StockReservationItems",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ReservationDate",
                table: "StockReservationItems",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
