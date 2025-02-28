 using Wms.Api.Entities; 

namespace Wms.Api.Dto.Warehouse
{
    public class WarehouseDetailsDto : CreatedChangedEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
    }

    public class WarehouseCreateUpdateDto
    {
        public required string Name { get; set; }
    }

    public class WarehouseSearchDto : PagedRequestAbstractDto
    {
        public required string Search { get; set; }
    }
}
