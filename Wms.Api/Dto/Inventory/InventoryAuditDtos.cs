using System.ComponentModel.DataAnnotations;
using Wms.Api.Dto;

namespace Wms.Api.Dto.Inventory;

public class InventoryAuditSearchDto : PagedRequestAbstractDto
{
    public string? Search { get; set; }
    public Guid? ProductId { get; set; }
}

public class InventoryAuditDto
{
    public Guid ProductId { get; set; }
    public string ProductCode { get; set; } = string.Empty;
    public string? Model { get; set; }
    public DateTime MovementDate { get; set; }
    public string MovementType { get; set; } = string.Empty; // STOCKIN | INVOICE
    public string ReferenceNumber { get; set; } = string.Empty; // StockIn number or Invoice number
    public int QuantityChange { get; set; } // + for stock-in, - for invoice
    public int BalanceAfter { get; set; }
    public decimal? CostPrice { get; set; }
    public decimal? AgentPrice { get; set; }
    public decimal? DealerPrice { get; set; }
    public decimal? RetailPrice { get; set; }
}

public class InventorySummarySearchDto : PagedRequestAbstractDto
{
    public string? Search { get; set; }
}

public class InventorySummaryRowDto
{
    public Guid ProductId { get; set; }
    public string ProductCode { get; set; } = string.Empty;
    public string? Model { get; set; }
    public int AvailableQuantity { get; set; }
    public decimal? CostPrice { get; set; }
    public decimal? AgentPrice { get; set; }
    public decimal? DealerPrice { get; set; }
    public decimal? RetailPrice { get; set; }
}

public class UpdateProductPricingDto
{
    [Range(0, double.MaxValue)]
    public decimal? CostPrice { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? AgentPrice { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? DealerPrice { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? RetailPrice { get; set; }
}
