using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class removeextracolumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Code",
                table: "Lookups");

            migrationBuilder.DropColumn(
                name: "MetaJson",
                table: "Lookups");

            migrationBuilder.DropColumn(
                name: "ParentCode",
                table: "Lookups");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Lookups",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MetaJson",
                table: "Lookups",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentCode",
                table: "Lookups",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
