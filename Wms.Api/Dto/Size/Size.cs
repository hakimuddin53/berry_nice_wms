using Wms.Api.Entities; 

namespace Wms.Api.Dto.Size
{
    public class SizeDetailsDto : CreatedChangedEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
    }

    public class SizeCreateUpdateDto
    {
        public required string Name { get; set; }
    }

    public class SizeSearchDto : PagedRequestAbstractDto
    {
        public required string Search { get; set; }
    }
}
