using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wms.Api.Dto.StockIn.StockInCreateUpdate
{
    public class StockInItemCreateUpdateDto
    {
        public Guid ProductId { get; set; }
        public Guid LocationId { get; set; }
        public string? PrimarySerialNumber { get; set; }
        public string? ManufactureSerialNumber { get; set; }
        public string? Region { get; set; }
        public string? Condition { get; set; }
        public decimal? RetailSellingPrice { get; set; }
        public decimal? DealerSellingPrice { get; set; }
        public decimal? AgentSellingPrice { get; set; }
        public decimal? Cost { get; set; }
        public string? Remarks { get; set; }
        public string? ItemsIncluded { get; set; }
        public int ReceiveQuantity { get; set; }
    }
}

