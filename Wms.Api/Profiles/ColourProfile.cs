using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.Colour;
using Wms.Api.Entities;

namespace Leitstand.Mapping.Profiles.v12_0;

public class ColourProfile : Profile
{
    public ColourProfile()
    {
        #region DetailsV12Dto
        CreateMap<Colour, ColourDetailsDto>(); 
        #endregion 

        #region CreateUpdateV12Dto
        CreateMap<ColourCreateUpdateDto, Colour>();
        #endregion

        CreateMap<Colour, SelectOptionV12Dto>()
        .ForMember(x => x.Value, option => option.MapFrom(y => y.Id))
        .ForMember(x => x.Label, option => option.MapFrom(y => y.Name));

    }
}