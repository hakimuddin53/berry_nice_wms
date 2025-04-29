using Wms.Api.Entities; 

namespace Wms.Api.Dto.Inventory
{
    public class InventoryDetailsDto : CreatedChangedEntity
    { 
        public Guid Id { get; set; } 
        public Guid ProductId { get; set; }  
        public Guid WarehouseId { get; set; } 
        public Guid CurrentLocationId { get; set; } 
        public int QuantityIn { get; set; } // Quantity added in the transaction 
        public int QuantityOut { get; set; } // Quantity removed in the transaction 
        public int OldBalance { get; set; } // Balance before the transaction 
        public int NewBalance { get; set; } // Balance after the transaction  

        public string Product { get; set; }
        public string ClientCode { get; set; }
        public string StockGroup { get; set; }
        public string Warehouse { get; set; }
        public string CurrentLocation { get; set; }
    } 

    public class InventorySearchDto : PagedRequestAbstractDto
    {
        public string[]? ProductId { get; set; }
        public string[]? WarehouseId { get; set; }
        public string[]? ClientCode { get; set; } 
        public string[]? LocationId { get; set; }
    }
}
