namespace Wms.Api.Dto.Customer.CustomerSearch
{
    public class CustomerSearchDto : PagedRequestAbstractDto
    {
        public string search { get; set; } = default!;
    }
}