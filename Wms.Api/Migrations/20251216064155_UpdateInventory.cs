using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateInventory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LowQty",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ManufactureSerialNumber",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "PrimarySerialNumber",
                table: "Products",
                newName: "SerialNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SerialNumber",
                table: "Products",
                newName: "PrimarySerialNumber");

            migrationBuilder.AddColumn<int>(
                name: "LowQty",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ManufactureSerialNumber",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
