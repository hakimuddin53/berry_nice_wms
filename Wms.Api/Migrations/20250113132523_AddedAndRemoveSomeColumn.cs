using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddedAndRemoveSomeColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockInDetails_StockIns_StockInId",
                table: "StockInDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_StockOutDetails_StockOuts_StockOutId",
                table: "StockOutDetails");

            migrationBuilder.DropTable(
                name: "CustomerReturns");

            migrationBuilder.DropTable(
                name: "ProductUoms");

            migrationBuilder.DropTable(
                name: "Uoms");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StockOutDetails",
                table: "StockOutDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StockInDetails",
                table: "StockInDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Inventory",
                table: "Inventory");

            migrationBuilder.DropColumn(
                name: "ExpirationDate",
                table: "StockReservations");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "StockReservations");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "StockReservations");

            migrationBuilder.DropColumn(
                name: "ReservationDate",
                table: "StockReservations");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "StockOuts");

            migrationBuilder.DropColumn(
                name: "WarehouseId",
                table: "StockOuts");

            migrationBuilder.DropColumn(
                name: "ListPrice",
                table: "StockOutDetails");

            migrationBuilder.DropColumn(
                name: "ProductUomId",
                table: "StockOutDetails");

            migrationBuilder.DropColumn(
                name: "ListPrice",
                table: "StockInDetails");

            migrationBuilder.DropColumn(
                name: "ProductUomId",
                table: "StockInDetails");

            migrationBuilder.RenameTable(
                name: "StockOutDetails",
                newName: "StockOutItems");

            migrationBuilder.RenameTable(
                name: "StockInDetails",
                newName: "StockInItems");

            migrationBuilder.RenameTable(
                name: "Inventory",
                newName: "Inventories");

            migrationBuilder.RenameColumn(
                name: "WarehouseId",
                table: "Products",
                newName: "CartonSizeId");

            migrationBuilder.RenameIndex(
                name: "IX_StockOutDetails_StockOutId",
                table: "StockOutItems",
                newName: "IX_StockOutItems_StockOutId");

            migrationBuilder.RenameIndex(
                name: "IX_StockInDetails_StockInId",
                table: "StockInItems",
                newName: "IX_StockInItems_StockInId");

            migrationBuilder.RenameColumn(
                name: "ProductUomId",
                table: "Inventories",
                newName: "StockTransferId");

            migrationBuilder.AddColumn<string>(
                name: "DONumber",
                table: "StockOuts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "LocationId",
                table: "StockIns",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "PONumber",
                table: "StockIns",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "ListPrice",
                table: "Products",
                type: "decimal(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "QuantityPerCarton",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SerialNumber",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "StockInId",
                table: "Inventories",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "StockOutId",
                table: "Inventories",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "TransactionType",
                table: "Inventories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_StockOutItems",
                table: "StockOutItems",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StockInItems",
                table: "StockInItems",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Inventories",
                table: "Inventories",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "CartonSizes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChangedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartonSizes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StockReservationItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StockReservationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StockReservationItemNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    ReservationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpirationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChangedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockReservationItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockReservationItems_StockReservations_StockReservationId",
                        column: x => x.StockReservationId,
                        principalTable: "StockReservations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StockTransfers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Number = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChangedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockTransfers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StockTransferItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StockTransferId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StockTransferItemNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuantityTransferred = table.Column<int>(type: "int", nullable: false),
                    FromWarehouseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ToWarehouseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChangedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockTransferItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockTransferItems_StockTransfers_StockTransferId",
                        column: x => x.StockTransferId,
                        principalTable: "StockTransfers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockReservationItems_StockReservationId",
                table: "StockReservationItems",
                column: "StockReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_StockTransferItems_StockTransferId",
                table: "StockTransferItems",
                column: "StockTransferId");

            migrationBuilder.AddForeignKey(
                name: "FK_StockInItems_StockIns_StockInId",
                table: "StockInItems",
                column: "StockInId",
                principalTable: "StockIns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StockOutItems_StockOuts_StockOutId",
                table: "StockOutItems",
                column: "StockOutId",
                principalTable: "StockOuts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockInItems_StockIns_StockInId",
                table: "StockInItems");

            migrationBuilder.DropForeignKey(
                name: "FK_StockOutItems_StockOuts_StockOutId",
                table: "StockOutItems");

            migrationBuilder.DropTable(
                name: "CartonSizes");

            migrationBuilder.DropTable(
                name: "StockReservationItems");

            migrationBuilder.DropTable(
                name: "StockTransferItems");

            migrationBuilder.DropTable(
                name: "StockTransfers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StockOutItems",
                table: "StockOutItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StockInItems",
                table: "StockInItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Inventories",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "DONumber",
                table: "StockOuts");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "StockIns");

            migrationBuilder.DropColumn(
                name: "PONumber",
                table: "StockIns");

            migrationBuilder.DropColumn(
                name: "ListPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "QuantityPerCarton",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SerialNumber",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "StockInId",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "StockOutId",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "TransactionType",
                table: "Inventories");

            migrationBuilder.RenameTable(
                name: "StockOutItems",
                newName: "StockOutDetails");

            migrationBuilder.RenameTable(
                name: "StockInItems",
                newName: "StockInDetails");

            migrationBuilder.RenameTable(
                name: "Inventories",
                newName: "Inventory");

            migrationBuilder.RenameColumn(
                name: "CartonSizeId",
                table: "Products",
                newName: "WarehouseId");

            migrationBuilder.RenameIndex(
                name: "IX_StockOutItems_StockOutId",
                table: "StockOutDetails",
                newName: "IX_StockOutDetails_StockOutId");

            migrationBuilder.RenameIndex(
                name: "IX_StockInItems_StockInId",
                table: "StockInDetails",
                newName: "IX_StockInDetails_StockInId");

            migrationBuilder.RenameColumn(
                name: "StockTransferId",
                table: "Inventory",
                newName: "ProductUomId");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpirationDate",
                table: "StockReservations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "ProductId",
                table: "StockReservations",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "StockReservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReservationDate",
                table: "StockReservations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "StockOuts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "WarehouseId",
                table: "StockOuts",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<decimal>(
                name: "ListPrice",
                table: "StockOutDetails",
                type: "decimal(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "ProductUomId",
                table: "StockOutDetails",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<decimal>(
                name: "ListPrice",
                table: "StockInDetails",
                type: "decimal(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "ProductUomId",
                table: "StockInDetails",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_StockOutDetails",
                table: "StockOutDetails",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StockInDetails",
                table: "StockInDetails",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Inventory",
                table: "Inventory",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "CustomerReturns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    ReasonForReturn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WarehouseType = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerReturns", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductUoms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChangedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UomId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductUoms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductUoms_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Uoms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChangedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Multiplier = table.Column<decimal>(type: "decimal(18,5)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Uoms", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductUoms_ProductId",
                table: "ProductUoms",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_StockInDetails_StockIns_StockInId",
                table: "StockInDetails",
                column: "StockInId",
                principalTable: "StockIns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StockOutDetails_StockOuts_StockOutId",
                table: "StockOutDetails",
                column: "StockOutId",
                principalTable: "StockOuts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
