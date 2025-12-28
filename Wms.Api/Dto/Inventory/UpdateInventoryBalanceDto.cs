namespace Wms.Api.Dto.Inventory
{
    public class UpdateInventoryBalanceDto
    {
        public string? Remark { get; set; }
        public string? InternalRemark { get; set; }
        public decimal? AgentPrice { get; set; }
        public decimal? DealerPrice { get; set; }
        public decimal? RetailPrice { get; set; }
        public decimal? CostPrice { get; set; }
        public Guid? LocationId { get; set; }
    }
}
