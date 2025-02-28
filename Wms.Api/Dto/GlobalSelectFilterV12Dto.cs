namespace Wms.Api.Dto
{
    public class GlobalSelectFilterV12Dto : PagedRequestAbstractDto
    {
        public string? SearchString { get; set; }
        public Guid[]? Ids { get; set; }
    }
}
