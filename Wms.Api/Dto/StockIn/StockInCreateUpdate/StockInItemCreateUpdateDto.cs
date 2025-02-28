using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Dto.StockIn.StockInCreateUpdate
{
    public class StockInItemCreateUpdateDto 
    { 
        public required string StockInItemNumber { get; set; } 
        public Guid ProductId { get; set; } 
        public int Quantity { get; set; } 
    }
}

