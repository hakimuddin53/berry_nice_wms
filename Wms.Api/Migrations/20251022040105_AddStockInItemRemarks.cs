using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddStockInItemRemarks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StockInItemRemarks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StockInItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Remark = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChangedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockInItemRemarks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockInItemRemarks_StockInItems_StockInItemId",
                        column: x => x.StockInItemId,
                        principalTable: "StockInItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockInItemRemarks_StockInItemId",
                table: "StockInItemRemarks",
                column: "StockInItemId");

            migrationBuilder.Sql(
                """
                INSERT INTO StockInItemRemarks (Id, StockInItemId, Remark, CreatedAt, CreatedById, ChangedAt, ChangedById)
                SELECT NEWID(), Id, Remarks, SYSUTCDATETIME(), 'df06e9cf-ab07-4e33-8004-2aad988eb251', NULL, NULL
                FROM StockInItems
                WHERE Remarks IS NOT NULL AND LTRIM(RTRIM(Remarks)) <> ''
                """);

            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "StockInItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockInItemRemarks");

            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "StockInItems",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
