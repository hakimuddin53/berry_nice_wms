using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class New001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockInItemRemarks");

            migrationBuilder.DropTable(
                name: "ProductRemarks");

            migrationBuilder.AddColumn<string>(
                name: "Remark",
                table: "StockInItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Remark",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Remark",
                table: "StockInItems");

            migrationBuilder.DropColumn(
                name: "Remark",
                table: "Products");

            migrationBuilder.CreateTable(
                name: "ProductRemarks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChangedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Remark = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductRemarks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductRemarks_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StockInItemRemarks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductRemarkId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StockInItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChangedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockInItemRemarks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockInItemRemarks_ProductRemarks_ProductRemarkId",
                        column: x => x.ProductRemarkId,
                        principalTable: "ProductRemarks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StockInItemRemarks_StockInItems_StockInItemId",
                        column: x => x.StockInItemId,
                        principalTable: "StockInItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductRemarks_ProductId",
                table: "ProductRemarks",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_StockInItemRemarks_ProductRemarkId",
                table: "StockInItemRemarks",
                column: "ProductRemarkId");

            migrationBuilder.CreateIndex(
                name: "IX_StockInItemRemarks_StockInItemId",
                table: "StockInItemRemarks",
                column: "StockInItemId");
        }
    }
}
