using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddProductGrade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "GradeId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_GradeId",
                table: "Products",
                column: "GradeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Lookups_GradeId",
                table: "Products",
                column: "GradeId",
                principalTable: "Lookups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Lookups_GradeId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_GradeId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "GradeId",
                table: "Products");
        }
    }
}
