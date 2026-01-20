using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.Customer.CustomerCreateUpdate;
using Wms.Api.Dto.Customer.CustomerDetails;
using Wms.Api.Entities;

namespace Wms.Api.Profiles;

public class CustomerProfile : Profile
{
    public CustomerProfile()
    {
        #region DetailsDto
        CreateMap<Customer, CustomerDetailsDto>()
            .ForMember(dest => dest.CustomerTypeLabel, opt => opt.MapFrom(src => src.CustomerType.Label));
        #endregion

        #region CreateUpdateDto
        CreateMap<CustomerCreateUpdateDto, Customer>()
            .ForMember(dest => dest.CustomerCode, opt => opt.Ignore());
        #endregion

        CreateMap<Customer, SelectOptionV12Dto>()
            .ForMember(x => x.Value, option => option.MapFrom(y => y.Id))
            .ForMember(x => x.Label, option => option.MapFrom(y => $"{y.Name} ({y.CustomerCode})"));
    }
}
