using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.Size;
using Wms.Api.Entities;

namespace Wms.Api.Profiles;

public class ClientCodeProfile : Profile
{
    public ClientCodeProfile()
    {
        #region DetailsV12Dto
        CreateMap<ClientCode, Dto.ClientCode.ClientCode.ClientCodeDetailsDto>(); 
        #endregion 

        #region CreateUpdateV12Dto
        CreateMap<Dto.ClientCode.ClientCode.ClientCodeCreateUpdateDto, ClientCode>();
        #endregion

        CreateMap<ClientCode, SelectOptionV12Dto>()
          .ForMember(x => x.Value, option => option.MapFrom(y => y.Id))
          .ForMember(x => x.Label, option => option.MapFrom(y => y.Name));

    }
}