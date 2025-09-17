namespace Wms.Api.Dto.Supplier.SupplierSearch
{
    public class SupplierSearchDto : PagedRequestAbstractDto
    {
        public string search { get; set; } = default!;
    }
}