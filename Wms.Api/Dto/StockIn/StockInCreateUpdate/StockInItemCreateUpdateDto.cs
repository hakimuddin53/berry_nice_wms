using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Dto.StockIn.StockInCreateUpdate
{
    public class StockInItemCreateUpdateDto 
    { 
        public Guid ProductId { get; set; }
        public Guid LocationId { get; set; }
        public int Quantity { get; set; } 
    }
}

