using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeProductIdToGuidProperly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Products",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CartonSizeId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ChangedAt",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ClientCodeId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ColourId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "DesignId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ItemCode",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ListPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProductPhotoUrl",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "QuantityPerCarton",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "Threshold",
                table: "Products",
                newName: "LowQty");

            migrationBuilder.RenameColumn(
                name: "SizeId",
                table: "Products",
                newName: "ProductId");

            migrationBuilder.RenameColumn(
                name: "SerialNumber",
                table: "Products",
                newName: "Sku");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Products",
                newName: "CreatedDate");

            migrationBuilder.RenameColumn(
                name: "ChangedById",
                table: "Products",
                newName: "StorageId");

            migrationBuilder.AddColumn<decimal>(
                name: "AgentPrice",
                table: "Products",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "BrandId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ColorId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DealerPrice",
                table: "Products",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "HasSerial",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "ModelId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ProcessorId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "RamId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RetailPrice",
                table: "Products",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "ScreenSizeId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Products",
                table: "Products",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_BrandId",
                table: "Products",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_ColorId",
                table: "Products",
                column: "ColorId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_ModelId",
                table: "Products",
                column: "ModelId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProcessorId",
                table: "Products",
                column: "ProcessorId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_RamId",
                table: "Products",
                column: "RamId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_ScreenSizeId",
                table: "Products",
                column: "ScreenSizeId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_StorageId",
                table: "Products",
                column: "StorageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Lookups_BrandId",
                table: "Products",
                column: "BrandId",
                principalTable: "Lookups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Lookups_CategoryId",
                table: "Products",
                column: "CategoryId",
                principalTable: "Lookups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Lookups_ColorId",
                table: "Products",
                column: "ColorId",
                principalTable: "Lookups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Lookups_ModelId",
                table: "Products",
                column: "ModelId",
                principalTable: "Lookups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Lookups_ProcessorId",
                table: "Products",
                column: "ProcessorId",
                principalTable: "Lookups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Lookups_RamId",
                table: "Products",
                column: "RamId",
                principalTable: "Lookups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Lookups_ScreenSizeId",
                table: "Products",
                column: "ScreenSizeId",
                principalTable: "Lookups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Lookups_StorageId",
                table: "Products",
                column: "StorageId",
                principalTable: "Lookups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Lookups_BrandId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Lookups_CategoryId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Lookups_ColorId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Lookups_ModelId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Lookups_ProcessorId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Lookups_RamId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Lookups_ScreenSizeId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Lookups_StorageId",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Products",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_BrandId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_CategoryId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_ColorId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_ModelId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_ProcessorId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_RamId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_ScreenSizeId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_StorageId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "AgentPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "BrandId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ColorId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "DealerPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "HasSerial",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ModelId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProcessorId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "RamId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "RetailPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ScreenSizeId",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "StorageId",
                table: "Products",
                newName: "ChangedById");

            migrationBuilder.RenameColumn(
                name: "Sku",
                table: "Products",
                newName: "SerialNumber");

            migrationBuilder.RenameColumn(
                name: "LowQty",
                table: "Products",
                newName: "Threshold");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "Products",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "Products",
                newName: "SizeId");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "Products",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "CartonSizeId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "ChangedAt",
                table: "Products",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ClientCodeId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "ColourId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "Products",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "DesignId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "ItemCode",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "ListPrice",
                table: "Products",
                type: "decimal(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProductPhotoUrl",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuantityPerCarton",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Products",
                table: "Products",
                column: "Id");
        }
    }
}
