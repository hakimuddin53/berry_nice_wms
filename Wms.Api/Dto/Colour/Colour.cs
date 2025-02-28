 using Wms.Api.Entities; 

namespace Wms.Api.Dto.Colour
{
    public class ColourDetailsDto : CreatedChangedEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
    }

    public class ColourCreateUpdateDto
    {
        public required string Name { get; set; }
    }

    public class ColourSearchDto : PagedRequestAbstractDto
    {
        public required string Search { get; set; }
    }
}
