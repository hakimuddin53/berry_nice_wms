using AutoMapper;
using Wms.Api.Dto.StockTake;
using Wms.Api.Entities;

namespace Wms.Api.Profiles;

public class StockTakeProfile : Profile
{
    public StockTakeProfile()
    {
        CreateMap<StockTake, StockTakeDetailsDto>();
        CreateMap<StockTakeItem, StockTakeItemDetailsDto>()
            .ForMember(dest => dest.ProductCode, opt => opt.MapFrom(src => src.Product != null ? src.Product.ProductCode : null));
    }
}
