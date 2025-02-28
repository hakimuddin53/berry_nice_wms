using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.Design;
using Wms.Api.Entities;

namespace Leitstand.Mapping.Profiles.v12_0;

public class DesignProfile : Profile
{
    public DesignProfile()
    {
        #region DetailsV12Dto
        CreateMap<Design, DesignDetailsDto>(); 
        #endregion 

        #region CreateUpdateV12Dto
        CreateMap<DesignCreateUpdateDto, Design>();
        #endregion

        CreateMap<Design, SelectOptionV12Dto>()
            .ForMember(x => x.Value, option => option.MapFrom(y => y.Id))
            .ForMember(x => x.Label, option => option.MapFrom(y => y.Name));

    }
}