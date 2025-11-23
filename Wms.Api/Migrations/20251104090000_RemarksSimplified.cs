using Microsoft.EntityFrameworkCore.Migrations;

namespace Wms.Api.Migrations
{
    public partial class RemarksSimplified : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1) Add Remark columns if they don't exist
            migrationBuilder.Sql(@"IF COL_LENGTH('StockInItems','Remark') IS NULL ALTER TABLE [StockInItems] ADD [Remark] nvarchar(max) NULL;");
            migrationBuilder.Sql(@"IF COL_LENGTH('Products','Remark') IS NULL ALTER TABLE [Products] ADD [Remark] nvarchar(max) NULL;
");

            // 2) Migrate existing remark data into the new columns (best-effort)
            migrationBuilder.Sql(@"
IF OBJECT_ID(N'[StockInItemRemarks]', 'U') IS NOT NULL AND OBJECT_ID(N'[ProductRemarks]', 'U') IS NOT NULL
BEGIN
    ;WITH R AS (
        SELECT sir.StockInItemId,
               STRING_AGG(pr.Remark, ',') WITHIN GROUP (ORDER BY pr.Remark) AS RemarkText
        FROM StockInItemRemarks sir
        INNER JOIN ProductRemarks pr ON pr.Id = sir.ProductRemarkId
        WHERE pr.Remark IS NOT NULL AND LTRIM(RTRIM(pr.Remark)) <> ''
        GROUP BY sir.StockInItemId
    )
    UPDATE si
    SET si.Remark = CASE WHEN si.Remark IS NULL OR LTRIM(RTRIM(si.Remark)) = '' THEN R.RemarkText ELSE si.Remark END
    FROM StockInItems si
    INNER JOIN R ON R.StockInItemId = si.Id;
END
");

            // 3) Drop dependent constraints and indexes, then drop legacy tables if they exist
            migrationBuilder.Sql(@"IF OBJECT_ID(N'[StockInItemRemarks]', 'U') IS NOT NULL
BEGIN
    DECLARE @sql NVARCHAR(MAX) = N'';
    -- Drop FKs referencing ProductRemarks
    SELECT @sql = STRING_AGG('ALTER TABLE ['+OBJECT_SCHEMA_NAME(parent_object_id)+'].['+OBJECT_NAME(parent_object_id)+'] DROP CONSTRAINT ['+name+'];', ' ')
    FROM sys.foreign_keys
    WHERE referenced_object_id = OBJECT_ID(N'ProductRemarks') OR parent_object_id = OBJECT_ID(N'StockInItemRemarks');
    IF @sql IS NOT NULL AND LEN(@sql) > 0 EXEC sp_executesql @sql;

    -- Drop indexes on StockInItemRemarks
    SET @sql = N'';
    SELECT @sql = STRING_AGG('DROP INDEX ['+i.name+'] ON [StockInItemRemarks];', ' ')
    FROM sys.indexes i
    WHERE i.object_id = OBJECT_ID(N'StockInItemRemarks') AND i.is_primary_key = 0 AND i.is_unique_constraint = 0 AND i.name IS NOT NULL;
    IF @sql IS NOT NULL AND LEN(@sql) > 0 EXEC sp_executesql @sql;

    -- Finally drop table
    DROP TABLE [StockInItemRemarks];
END");

            migrationBuilder.Sql(@"IF OBJECT_ID(N'[ProductRemarks]', 'U') IS NOT NULL
BEGIN
    DECLARE @sql2 NVARCHAR(MAX) = N'';
    -- Drop indexes on ProductRemarks
    SELECT @sql2 = STRING_AGG('DROP INDEX ['+i.name+'] ON [ProductRemarks];', ' ')
    FROM sys.indexes i
    WHERE i.object_id = OBJECT_ID(N'ProductRemarks') AND i.is_primary_key = 0 AND i.is_unique_constraint = 0 AND i.name IS NOT NULL;
    IF @sql2 IS NOT NULL AND LEN(@sql2) > 0 EXEC sp_executesql @sql2;

    DROP TABLE [ProductRemarks];
END");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Best-effort down: recreate legacy tables (empty), and drop new columns
            migrationBuilder.Sql(@"IF OBJECT_ID(N'[ProductRemarks]', 'U') IS NULL
BEGIN
    CREATE TABLE [ProductRemarks] (
        [Id] uniqueidentifier NOT NULL,
        [ProductId] uniqueidentifier NOT NULL,
        [Remark] nvarchar(256) NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
        [CreatedById] uniqueidentifier NULL,
        [ChangedAt] datetime2 NULL,
        [ChangedById] uniqueidentifier NULL,
        CONSTRAINT [PK_ProductRemarks] PRIMARY KEY ([Id])
    );
END");

            migrationBuilder.Sql(@"IF OBJECT_ID(N'[StockInItemRemarks]', 'U') IS NULL
BEGIN
    CREATE TABLE [StockInItemRemarks] (
        [Id] uniqueidentifier NOT NULL,
        [StockInItemId] uniqueidentifier NOT NULL,
        [ProductRemarkId] uniqueidentifier NOT NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
        [CreatedById] uniqueidentifier NULL,
        [ChangedAt] datetime2 NULL,
        [ChangedById] uniqueidentifier NULL,
        CONSTRAINT [PK_StockInItemRemarks] PRIMARY KEY ([Id])
    );
END");

            migrationBuilder.Sql(@"IF COL_LENGTH('StockInItems','Remark') IS NOT NULL ALTER TABLE [StockInItems] DROP COLUMN [Remark];");
            migrationBuilder.Sql(@"IF COL_LENGTH('Products','Remark') IS NOT NULL ALTER TABLE [Products] DROP COLUMN [Remark];");
        }
    }
}
