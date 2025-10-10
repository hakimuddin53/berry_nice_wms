namespace Wms.Api.Dto.StockIn.StockInDetails
{
    public class StockInItemDetailsDto
    {
        public Guid Id { get; set; }
        public Guid StockInId { get; set; }
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

        // Display fields
        public string? ProductCode { get; set; }
        public string? ProductName { get; set; }
    }
}

