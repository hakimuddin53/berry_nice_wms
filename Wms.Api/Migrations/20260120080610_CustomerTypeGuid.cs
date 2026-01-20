using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class CustomerTypeGuid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CustomerTypeId",
                table: "Customers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.Sql(@"
UPDATE c
SET CustomerTypeId = l.Id
FROM Customers c
JOIN Lookups l ON l.GroupKey = 1 AND l.Label = c.CustomerType;

UPDATE Customers
SET CustomerTypeId = (
    SELECT TOP 1 Id
    FROM Lookups
    WHERE GroupKey = 1
    ORDER BY SortOrder, Label)
WHERE CustomerTypeId IS NULL;
");

            migrationBuilder.AlterColumn<Guid>(
                name: "CustomerTypeId",
                table: "Customers",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "CustomerType",
                table: "Customers");

            migrationBuilder.CreateIndex(
                name: "IX_Customers_CustomerTypeId",
                table: "Customers",
                column: "CustomerTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Lookups_CustomerTypeId",
                table: "Customers",
                column: "CustomerTypeId",
                principalTable: "Lookups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Lookups_CustomerTypeId",
                table: "Customers");

            migrationBuilder.DropIndex(
                name: "IX_Customers_CustomerTypeId",
                table: "Customers");

            migrationBuilder.AddColumn<string>(
                name: "CustomerType",
                table: "Customers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql(@"
UPDATE c
SET CustomerType = l.Label
FROM Customers c
LEFT JOIN Lookups l ON l.Id = c.CustomerTypeId AND l.GroupKey = 1
WHERE l.Label IS NOT NULL;

UPDATE Customers
SET CustomerType = 'Retail'
WHERE ISNULL(CustomerType, '') = '';
");

            migrationBuilder.DropColumn(
                name: "CustomerTypeId",
                table: "Customers");
        }
    }
}
