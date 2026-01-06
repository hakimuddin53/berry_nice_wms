using System;

namespace Wms.Api.Dto.Inventory
{
    public class PurchaseQualityReportSearchDto : PagedRequestAbstractDto
    {
        public string? Search { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class PurchaseQualityReportRowDto
    {
        public string Purchaser { get; set; } = string.Empty;
        public decimal PurchaseTotal { get; set; }
        public decimal SoldTotal { get; set; }
        public decimal Profit { get; set; }
    }
}
