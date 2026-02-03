namespace Wms.Api.Model
{     
    public enum OperationTypeEnum
    {
        STOCKRECEIVE = 0, 
        STOCKTRANSFER = 1, 
        PRODUCT = 2, 
        INVOICE = 3,
        STOCKTAKE = 4,
        CUSTOMER = 5,
        SUPPLIER = 6
    }

    public enum TransactionTypeEnum
    {
        STOCKRECEIVE = 0,
        STOCKTRANSFERIN = 2,
        STOCKTRANSFEROUT = 3,
        INVOICE = 4,
        STOCKTAKE = 5
    }

    public enum ModuleEnum
    {
        STOCKRECEIVE = 0,
        STOCKTRANSFER = 2,
        STOCKRESERVATION = 3,
        CATEGORY = 4,
        COLOUR = 5,
        DESIGN = 6,
        LOCATION = 7,
        PRODUCT = 8,
        INVENTORY = 9,
        SIZE = 10,
        WAREHOUSE = 11,
        USER = 12,
        USERROLE = 13, 
        STOCKADJUSTMENT = 14,
        INVOICE = 15,
        STOCKTAKE = 16,
        LOOKUP = 17,
        CUSTOMER = 18,
        SUPPLIER = 19,
        EXPENSE = 20
    }

    public enum ReservationStatusEnum
    {
        ACTIVE = 0,
        FULFILLED = 1,
        CANCELREQUESTED = 2,
        CANCELLED = 3,
        RELEASED = 4
    }

    public enum ReservationItemStatusEnum
    {
        ACTIVE = 0,
        FULFILLED = 1
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
        Warehouse = 17,
        Grade = 18,
        Remark = 19,
        LogbookStatus = 20,
    }
} 
