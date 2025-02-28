 using Wms.Api.Entities; 

namespace Wms.Api.Dto.Design
{
    public class DesignDetailsDto : CreatedChangedEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
    }

    public class DesignCreateUpdateDto
    {
        public required string Name { get; set; }
    }

    public class DesignSearchDto : PagedRequestAbstractDto
    {
        public required string Search { get; set; }
    }
}
