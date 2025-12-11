using System.Collections.Generic;

namespace Wms.Api.Dto.StockRecieve.StockRecieveDetails
{
    public class StockRecieveItemDetailsDto
    {
        public Guid Id { get; set; }
        public Guid StockRecieveId { get; set; }
        public Guid ProductId { get; set; }
        public string ProductCode { get; set; } = default!;
        public Guid CategoryId { get; set; }
        public Guid? BrandId { get; set; }
        public string? Model { get; set; }
        public Guid? ColorId { get; set; }
        public Guid? StorageId { get; set; }
        public Guid? RamId { get; set; }
        public Guid? ProcessorId { get; set; }
        public Guid? ScreenSizeId { get; set; }
        public Guid LocationId { get; set; }
        public string? PrimarySerialNumber { get; set; }
        public string? ManufactureSerialNumber { get; set; }
        public string? Region { get; set; }
        public string? NewOrUsed { get; set; }
        public decimal? RetailSellingPrice { get; set; }
        public decimal? DealerSellingPrice { get; set; }
        public decimal? AgentSellingPrice { get; set; }
        public decimal? Cost { get; set; }
    public int ReceiveQuantity { get; set; }

    // Aggregated, free-text remark(s)
    public string? Remark { get; set; }
    public string? InternalRemark { get; set; }

        public string? ProductName { get; set; }
    }
}

