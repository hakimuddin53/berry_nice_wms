using System.ComponentModel.DataAnnotations;
using Wms.Api.Dto;

namespace Wms.Api.Dto.Inventory;

public class InventoryAuditSearchDto : PagedRequestAbstractDto
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
}

public class InventoryAuditDto
{
    public Guid ProductId { get; set; }
    public string ProductCode { get; set; } = string.Empty;
    public string? Model { get; set; }
    public Guid WarehouseId { get; set; }
    public string WarehouseLabel { get; set; } = string.Empty;
    public DateTime MovementDate { get; set; }
    public string MovementType { get; set; } = string.Empty; // StockRecieve | INVOICE | STOCKTRANSFERIN | STOCKTRANSFEROUT
    public string ReferenceNumber { get; set; } = string.Empty; // StockRecieve number or Invoice number or transfer id
    public int QuantityIn { get; set; }
    public int QuantityOut { get; set; }
    public int OldBalance { get; set; }
    public int NewBalance { get; set; }
    public decimal? CostPrice { get; set; }
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

