using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Entities
{
    [Index(nameof(ProductId), nameof(WarehouseId), nameof(Quantity))]
    [Index(nameof(CurrentLocationId))]
    public class InventoryBalance
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public Guid WarehouseId { get; set; }
        public Guid CurrentLocationId { get; set; }
        public int Quantity { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }  // Concurrency token

    }
}
