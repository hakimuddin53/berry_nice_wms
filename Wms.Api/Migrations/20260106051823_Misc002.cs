using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class Misc002 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CartonSizeId",
                table: "AspNetRoles");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CartonSizeId",
                table: "AspNetRoles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
