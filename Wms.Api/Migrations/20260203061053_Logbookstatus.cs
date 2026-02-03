using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wms.Api.Migrations
{
    /// <inheritdoc />
    public partial class Logbookstatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Ensure lookup seeds for OUT / RETURNED exist
            migrationBuilder.Sql("""
                IF NOT EXISTS (SELECT 1 FROM Lookups WHERE GroupKey = 20 AND Label = 'OUT')
                BEGIN
                    INSERT INTO Lookups (Id, GroupKey, Label, SortOrder, IsActive, CreatedAt, CreatedById)
                    VALUES (NEWID(), 20, 'OUT', 1, 1, GETUTCDATE(), '00000000-0000-0000-0000-000000000000');
                END
                IF NOT EXISTS (SELECT 1 FROM Lookups WHERE GroupKey = 20 AND Label = 'RETURNED')
                BEGIN
                    INSERT INTO Lookups (Id, GroupKey, Label, SortOrder, IsActive, CreatedAt, CreatedById)
                    VALUES (NEWID(), 20, 'RETURNED', 2, 1, GETUTCDATE(), '00000000-0000-0000-0000-000000000000');
                END
            """);

            migrationBuilder.Sql("""
                IF OBJECT_ID('tempdb..#OutStatusId') IS NOT NULL DROP TABLE #OutStatusId;
                SELECT TOP 1 Id AS OutId INTO #OutStatusId FROM Lookups WHERE GroupKey = 20 AND Label = 'OUT';
            """);

            migrationBuilder.AddColumn<Guid>(
                name: "LogbookStatusId",
                table: "LogbookStatusHistories",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LogbookStatusId",
                table: "LogbookEntries",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE h
                SET LogbookStatusId = COALESCE(l.Id, outId.OutId)
                FROM LogbookStatusHistories h
                CROSS JOIN #OutStatusId outId
                LEFT JOIN Lookups l ON l.Label = CAST(h.Status AS nvarchar(255)) AND l.GroupKey = 20;

                UPDATE e
                SET LogbookStatusId = COALESCE(l.Id, outId.OutId)
                FROM LogbookEntries e
                CROSS JOIN #OutStatusId outId
                LEFT JOIN Lookups l ON l.Label = CAST(e.Status AS nvarchar(255)) AND l.GroupKey = 20;
            """);

            migrationBuilder.AlterColumn<Guid>(
                name: "LogbookStatusId",
                table: "LogbookStatusHistories",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "LogbookStatusId",
                table: "LogbookEntries",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "Status",
                table: "LogbookStatusHistories");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "LogbookEntries");

            migrationBuilder.CreateIndex(
                name: "IX_LogbookStatusHistories_LogbookStatusId",
                table: "LogbookStatusHistories",
                column: "LogbookStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_LogbookEntries_LogbookStatusId",
                table: "LogbookEntries",
                column: "LogbookStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_LogbookEntries_Lookups_LogbookStatusId",
                table: "LogbookEntries",
                column: "LogbookStatusId",
                principalTable: "Lookups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LogbookStatusHistories_Lookups_LogbookStatusId",
                table: "LogbookStatusHistories",
                column: "LogbookStatusId",
                principalTable: "Lookups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.Sql("DROP TABLE #OutStatusId;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LogbookEntries_Lookups_LogbookStatusId",
                table: "LogbookEntries");

            migrationBuilder.DropForeignKey(
                name: "FK_LogbookStatusHistories_Lookups_LogbookStatusId",
                table: "LogbookStatusHistories");

            migrationBuilder.DropIndex(
                name: "IX_LogbookStatusHistories_LogbookStatusId",
                table: "LogbookStatusHistories");

            migrationBuilder.DropIndex(
                name: "IX_LogbookEntries_LogbookStatusId",
                table: "LogbookEntries");

            migrationBuilder.DropColumn(
                name: "LogbookStatusId",
                table: "LogbookStatusHistories");

            migrationBuilder.DropColumn(
                name: "LogbookStatusId",
                table: "LogbookEntries");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "LogbookStatusHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "LogbookEntries",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
