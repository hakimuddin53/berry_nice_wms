using System;
using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.Customer.CustomerCreateUpdate
{
    public class CustomerCreateUpdateDto
    {
        public string? CustomerCode { get; set; }
        [Required]
        public string Name { get; set; } = default!;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        [Required]
        public Guid CustomerTypeId { get; set; }
    }
}
