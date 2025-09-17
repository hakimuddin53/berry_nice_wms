namespace Wms.Api.Model
{     
    public enum OperationTypeEnum
    {
        STOCKIN = 0, 
        STOCKOUT = 1, 
        STOCKRESERVATION = 2, 
        STOCKTRANSFER = 3, 
        PRODUCT = 4,
        STOCKADJUSTMENT = 5, 
    }

    public enum TransactionTypeEnum
    {
        STOCKIN = 0,
        STOCKOUT = 1,
        STOCKTRANSFERIN = 2,
        STOCKTRANSFEROUT = 3,
        STOCKADJUSTMENT = 4,
        BULKUPLOAD = 5,
        STOCKOUTCANCEL = 6
    }

    public enum ModuleEnum
    {
        STOCKIN = 0,
        STOCKOUT = 1,
        STOCKTRANSFER = 2,
        STOCKRESERVATION = 3,
        CATEGORY = 4,
        COLOUR = 5,
        DESIGN = 6,
        LOCATION = 7,
        PRODUCT = 8,
        INVENTORY = 9,
        SIZE = 10,
        STOCKGROUP = 11,
        WAREHOUSE = 12,
        USER = 13,
        USERROLE = 14, 
        CLIENTCODE = 15,
        STOCKADJUSTMENT = 16,
    }

    public enum ReservationStatusEnum
    {
        ACTIVE = 0,         // just reserved
        FULFILLED = 1,      // consumed by a stock-out
        CANCELREQUESTED = 2,// someone asked to cancel (needs approval)
        CANCELLED = 3,      // approved cancellation
        RELEASED = 4        // expired or voided automatically
    }

    public enum ReservationItemStatusEnum
    {
        ACTIVE = 0,         // just reserved
        FULFILLED = 1,      // consumed by a stock-out 
    }

    public enum StockOutStatusEnum
    { 
        COMPLETED = 0,  
        CANCELLED = 1     
    }

    public enum LookupGroupKey
    {
        CustomerType = 1,
        SalesType = 2,
        PaymentType = 3,
        Location = 4,
        Region = 5,
        NewOrUsed = 6,
        InventoryStatus = 7,
        ProductCategory = 8,
        ExpenseCategory = 9,
        ScreenSize = 10,
        Color = 11,
        Storage = 12,
        Ram = 13,  
        Processor = 14,
        Brand = 15,
        Model = 16,
    }
} 