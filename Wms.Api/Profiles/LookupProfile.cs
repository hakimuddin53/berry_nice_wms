using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.Lookup;
using Wms.Api.Dto.StockIn.StockInCreateUpdate;
using Wms.Api.Entities;

namespace Wms.Api.Profiles;

public class LookupProfile : Profile
{
    public LookupProfile()
    { 
        #region Lookup to DTO
        CreateMap<Lookup, LookupDetailsDto>();  
        #endregion

        CreateMap<Lookup, SelectOptionV12Dto>()
            .ForMember(x => x.Value, option => option.MapFrom(y => y.Id))
            .ForMember(x => x.Label, option => option.MapFrom(y => y.Label));
    }
}