using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class RegionAndConditionIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NewOrUsed",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "Products");

            migrationBuilder.AddColumn<Guid>(
                name: "NewOrUsedId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "RegionId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_NewOrUsedId",
                table: "Products",
                column: "NewOrUsedId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_RegionId",
                table: "Products",
                column: "RegionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Lookups_NewOrUsedId",
                table: "Products",
                column: "NewOrUsedId",
                principalTable: "Lookups",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Lookups_RegionId",
                table: "Products",
                column: "RegionId",
                principalTable: "Lookups",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Lookups_NewOrUsedId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Lookups_RegionId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_NewOrUsedId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_RegionId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "NewOrUsedId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "RegionId",
                table: "Products");

            migrationBuilder.AddColumn<string>(
                name: "NewOrUsed",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
