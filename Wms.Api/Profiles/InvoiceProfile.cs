using AutoMapper;
using Wms.Api.Dto.Invoice.InvoiceCreateUpdate;
using Wms.Api.Dto.Invoice.InvoiceDetails;
using Wms.Api.Entities;

namespace Wms.Api.Profiles
{
    public class InvoiceProfile : Profile
    {
        public InvoiceProfile()
        {
            CreateMap<Invoice, InvoiceDetailsDto>()
                .ForMember(dest => dest.InvoiceItems, opt => opt.MapFrom(src => src.InvoiceItems));

            CreateMap<InvoiceItem, InvoiceItemDetailsDto>();

            CreateMap<InvoiceCreateUpdateDto, Invoice>()
                .ForMember(dest => dest.InvoiceItems, opt => opt.MapFrom(src => src.InvoiceItems));

            CreateMap<InvoiceItemCreateUpdateDto, InvoiceItem>();
        }
    }
}
