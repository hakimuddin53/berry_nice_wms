using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.Location;
using Wms.Api.Entities;

namespace Leitstand.Mapping.Profiles.v12_0;

public class LocationProfile : Profile
{
    public LocationProfile()
    {
        #region DetailsV12Dto
        CreateMap<Location, LocationDetailsDto>(); 
        #endregion 

        #region CreateUpdateV12Dto
        CreateMap<LocationCreateUpdateDto, Location>();
        #endregion

        CreateMap<Location, SelectOptionV12Dto>()
            .ForMember(x => x.Value, option => option.MapFrom(y => y.Id))
            .ForMember(x => x.Label, option => option.MapFrom(y => y.Name));

    }
}