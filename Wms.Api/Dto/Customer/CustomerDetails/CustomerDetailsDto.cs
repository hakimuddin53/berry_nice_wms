using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.Customer.CustomerDetails
{
    public class CustomerDetailsDto
    {
        public Guid Id { get; set; }
        public string CustomerCode { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public Guid CustomerTypeId { get; set; }
        public string? CustomerTypeLabel { get; set; }

        public DateTime CreatedAt { get; set; }
        public Guid CreatedById { get; set; }
        public DateTime? ChangedAt { get; set; }
        public Guid? ChangedById { get; set; }
    }

    public class CustomerFindByParametersDto : PagedRequestAbstractDto
    {
        public Guid[] CustomerIds { get; set; } = [];
    }
}
