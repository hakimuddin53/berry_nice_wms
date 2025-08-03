 using Wms.Api.Entities; 

namespace Wms.Api.Dto.Location
{
    public class LocationDetailsDto : CreatedChangedEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
    }

    public class LocationCreateUpdateDto
    {
        public required string Name { get; set; }
    }

    public class LocationSearchDto : PagedRequestAbstractDto
    {
        public required string Search { get; set; }
    }
    
    public class LocationFindByParametersDto : PagedRequestAbstractDto
    {
        public Guid[] LocationIds { get; set; } = [];
    }

    public class ActiveLocationDto  
    {
        public Guid LocationId { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
    }
}
