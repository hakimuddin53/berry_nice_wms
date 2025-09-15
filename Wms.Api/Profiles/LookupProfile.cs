using AutoMapper;
using Wms.Api.Dto.Lookup;
using Wms.Api.Dto.StockIn.StockInCreateUpdate;
using Wms.Api.Entities;

namespace Wms.Api.Profiles;

public class LookupProfile : Profile
{
    public LookupProfile()
    { 
        CreateMap<Lookup, LookupDetailsDto>();  
         
        CreateMap<LookupCreateUpdateDto, Lookup>(); 

    }
}