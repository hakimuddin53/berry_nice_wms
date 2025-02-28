using System.ComponentModel;

namespace Wms.Api.Model
{
    public enum ClientCodeEnum
    {
        [Description("Petronas")]
        PETRONAS = 0,

        [Description("Proton")]
        PROTON = 1,

        [Description("Utp")]
        UTP = 2,

        [Description("Mxd")]
        MXD = 3,        
    }

    public enum OperationTypeEnum
    {
        STOCKIN = 0,
        STOCKINITEM = 1,
        STOCKOUT = 3,
        STOCKOUTITEM = 4,
        STOCKRESERVATION = 5,
        STOCKRESERVATIONITEM = 6,
        STOCKTRANSFER = 7,
        STOCKTRANSFERITEM = 8,
        PRODUCTSERIALNUMBER = 9,
    }

    public enum TransactionTypeEnum
    {
        STOCKIN = 0,
        STOCKOUT = 1,
        STOCKTRANSFERIN = 2,
        STOCKTRANSFEROUT = 3,
    }
}
