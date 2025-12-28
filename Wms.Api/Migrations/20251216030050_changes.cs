using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class changes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InternalRemark",
                table: "StockRecieveItems");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "StockRecieveItems");

            migrationBuilder.DropColumn(
                name: "Remark",
                table: "StockRecieveItems");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "Imei",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "ManufactureSerialNumber",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "PrimarySerialNumber",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "ProductCode",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "UnitOfMeasure",
                table: "InvoiceItems");

            migrationBuilder.AddColumn<string>(
                name: "InternalRemark",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LocationId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "WarrantyExpiryDate",
                table: "InvoiceItems",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProductAuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PropertyName = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    OldValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NewValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ChangedBy = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductAuditLogs", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductAuditLogs");

            migrationBuilder.DropColumn(
                name: "InternalRemark",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "WarrantyExpiryDate",
                table: "InvoiceItems");

            migrationBuilder.AddColumn<string>(
                name: "InternalRemark",
                table: "StockRecieveItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LocationId",
                table: "StockRecieveItems",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "Remark",
                table: "StockRecieveItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "InvoiceItems",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Imei",
                table: "InvoiceItems",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ManufactureSerialNumber",
                table: "InvoiceItems",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimarySerialNumber",
                table: "InvoiceItems",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProductCode",
                table: "InvoiceItems",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "InvoiceItems",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UnitOfMeasure",
                table: "InvoiceItems",
                type: "nvarchar(32)",
                maxLength: 32,
                nullable: true);
        }
    }
}
