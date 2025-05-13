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
}
