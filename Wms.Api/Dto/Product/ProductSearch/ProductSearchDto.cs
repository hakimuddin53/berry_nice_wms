namespace Wms.Api.Dto.Product.ProductSearch
{
    public class ProductSearchDto : PagedRequestAbstractDto
    { 
        public required string search { get; set; }       
    }
}
