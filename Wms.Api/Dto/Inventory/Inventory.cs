using Wms.Api.Entities;
using Wms.Api.Model;

namespace Wms.Api.Dto.Inventory
{
    public class InventoryDetailsDto : CreatedChangedEntity
    { 
        public Guid Id { get; set; } 
        public Guid ProductId { get; set; }  
        public Guid WarehouseId { get; set; } 
        public Guid CurrentLocationId { get; set; } 
        public TransactionTypeEnum TransactionType { get; set; }
        
        public Guid StockRecieveId { get; set; }
        public Guid InvoiceId { get; set; }
        public Guid StockTransferId { get; set; }
        public Guid StockAdjustmentId { get; set; }
        
        public string TransactionNumber { get; set; } = string.Empty;
        public string OrderNumber { get; set; } = string.Empty;

        public int QuantityIn { get; set; } // Quantity added in the transaction 
        public int QuantityOut { get; set; } // Quantity removed in the transaction 
        public int OldBalance { get; set; } // Balance before the transaction 
        public int NewBalance { get; set; } // Balance after the transaction  

        public int ReservedQuantity { get; set; }
        public int AvailableQuantity { get; set; }   // keep this as before
        public int FreeQuantity { get; set; }   // ← new

        public string Product { get; set; }
        public string ClientCode { get; set; }
        public string StockGroup { get; set; }
        public string Warehouse { get; set; }
        public string CurrentLocation { get; set; }
        public string Size { get; set; }
    } 
    
    public class InventorySummaryDetailsDto : CreatedChangedEntity
    { 
        public Guid Id { get; set; } 
        public Guid ProductId { get; set; }  
        public Guid WarehouseId { get; set; } 
        public Guid CurrentLocationId { get; set; } = Guid.Empty; // Default to empty if not set
        public int AvailableQuantity { get; set; } // Quantity available
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public string ClientCode { get; set; }
        public string StockGroup { get; set; }
        public string Warehouse { get; set; }
        public string CurrentLocation { get; set; }
        
        public string Size { get; set; }
    }

    public class InventorySummaryByProductDetailsDto : CreatedChangedEntity
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public Guid WarehouseId { get; set; } 
        public int AvailableQuantity { get; set; }
        public int ReservedQuantity { get; set; }
        public int AvailableAfterReserved { get; set; }
        public string Product { get; set; }
        public string ClientCode { get; set; }
        public string StockGroup { get; set; }
        public string Warehouse { get; set; } 

        public string Size { get; set; }
    }

    public class InventorySearchDto : PagedRequestAbstractDto
    {
        public string[]? ProductId { get; set; }
        public string[]? WarehouseId { get; set; }
        public string[]? ClientCodeId { get; set; } 
        public string[]? LocationId { get; set; }

    }
}

