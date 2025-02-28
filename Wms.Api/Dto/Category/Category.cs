 using Wms.Api.Entities; 

namespace Wms.Api.Dto.Category
{
    public class CategoryDetailsDto : CreatedChangedEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
    }

    public class CategoryCreateUpdateDto
    {
        public required string Name { get; set; }
    }

    public class CategorySearchDto : PagedRequestAbstractDto
    {
        public required string Search { get; set; }
    }
}
