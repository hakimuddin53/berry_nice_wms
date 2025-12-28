using AutoMapper;
using Wms.Api.Dto.StockTransfer;
using Wms.Api.Entities;

namespace Wms.Api.Profiles;

public class StockTransferProfile : Profile
{
    public StockTransferProfile()
    {
        CreateMap<StockTransfer, StockTransferDetailsDto>()
            .ForMember(dest => dest.ProductCode, opt => opt.MapFrom(src => src.Product != null ? src.Product.ProductCode : null));
    }
}
