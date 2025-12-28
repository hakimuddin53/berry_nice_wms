using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wms.Api.Model;

namespace Wms.Api.Entities
{
    public class Inventory : CreatedChangedEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public TransactionTypeEnum TransactionType { get; set; }

        [Required]
        public Guid ProductId { get; set; }
         
        [Required]
        public Guid WarehouseId { get; set; }

        public string? Remark { get; set; }

        [Required]
        public Guid StockRecieveId { get; set; }

        [Required]
        public Guid StockTransferId { get; set; }

        public Guid? InvoiceId { get; set; } // New field for invoice reference

        [Required]
        public int QuantityIn { get; set; } // Quantity added in the transaction

        [Required]
        public int QuantityOut { get; set; } // Quantity removed in the transaction

        [Required]
        public int OldBalance { get; set; } // Balance before the transaction

        [Required]
        public int NewBalance { get; set; } // Balance after the transaction
    }
}
