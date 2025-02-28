 using Wms.Api.Entities; 

namespace Wms.Api.Dto.CartonSize
{
    public class CartonSizeDetailsDto : CreatedChangedEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
    }

    public class CartonSizeCreateUpdateDto
    {
        public required string Name { get; set; }
    }

    public class CartonSizeSearchDto : PagedRequestAbstractDto
    {
        public required string Search { get; set; }
    }
}
