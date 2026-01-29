using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRemark : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Remark",
                table: "Invoices");

            migrationBuilder.AddColumn<string>(
                name: "Remark",
                table: "InvoiceItems",
                type: "nvarchar(512)",
                maxLength: 512,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Remark",
                table: "InvoiceItems");

            migrationBuilder.AddColumn<string>(
                name: "Remark",
                table: "Invoices",
                type: "nvarchar(512)",
                maxLength: 512,
                nullable: true);
        }
    }
}
