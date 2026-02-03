using System;

namespace Wms.Api.Dto.Inventory
{
    public class InvoicedProductReportSearchDto : PagedRequestAbstractDto
    {
        public string? Search { get; set; }
        public Guid? ProductId { get; set; }
        public string? Model { get; set; }
        public Guid? WarehouseId { get; set; }
        public Guid? LocationId { get; set; }
        public Guid? CategoryId { get; set; }
        public Guid? BrandId { get; set; }
        public Guid? ColorId { get; set; }
        public Guid? StorageId { get; set; }
        public Guid? RamId { get; set; }
        public Guid? ProcessorId { get; set; }
        public Guid? ScreenSizeId { get; set; }
        public Guid? GradeId { get; set; }
        public Guid? RegionId { get; set; }
        public Guid? NewOrUsedId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class InvoicedProductReportRowDto
    {
        public Guid InvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime DateOfSale { get; set; }
        public Guid? ProductId { get; set; }
        public string ProductCode { get; set; } = string.Empty;
        public string? Model { get; set; }
        public Guid? WarehouseId { get; set; }
        public string WarehouseLabel { get; set; } = string.Empty;
        public Guid? LocationId { get; set; }
        public string? LocationLabel { get; set; }
        public string? CategoryLabel { get; set; }
        public string? BrandLabel { get; set; }
        public string? ColorLabel { get; set; }
        public string? StorageLabel { get; set; }
        public string? RamLabel { get; set; }
        public string? ProcessorLabel { get; set; }
        public string? ScreenSizeLabel { get; set; }
        public string? GradeLabel { get; set; }
        public string? RegionLabel { get; set; }
        public string? NewOrUsedLabel { get; set; }
        public int? BatteryHealth { get; set; }
        public string? Remark { get; set; }
        public string? InternalRemark { get; set; }
        public string? SerialNumber { get; set; }
        public int Quantity { get; set; }
        public decimal? CostPrice { get; set; }
        public decimal? RetailPrice { get; set; }
        public decimal? AgentPrice { get; set; }
        public decimal? DealerPrice { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
