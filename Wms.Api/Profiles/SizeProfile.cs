using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.Size;
using Wms.Api.Entities;

namespace Leitstand.Mapping.Profiles.v12_0;

public class SizeProfile : Profile
{
    public SizeProfile()
    {
        #region DetailsV12Dto
        CreateMap<Size, SizeDetailsDto>(); 
        #endregion 

        #region CreateUpdateV12Dto
        CreateMap<SizeCreateUpdateDto, Size>();
        #endregion

        CreateMap<Size, SelectOptionV12Dto>()
          .ForMember(x => x.Value, option => option.MapFrom(y => y.Id))
          .ForMember(x => x.Label, option => option.MapFrom(y => y.Name));

    }
}