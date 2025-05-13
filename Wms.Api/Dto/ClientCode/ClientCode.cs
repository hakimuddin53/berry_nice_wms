using Wms.Api.Entities;

namespace Wms.Api.Dto.ClientCode;

public class ClientCode
{
    public class ClientCodeDetailsDto : CreatedChangedEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
    }

    public class ClientCodeCreateUpdateDto
    {
        public required string Name { get; set; }
    }

    public class ClientCodeSearchDto : PagedRequestAbstractDto
    {
        public required string Search { get; set; }
    }
}