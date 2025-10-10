using AutoMapper;
using Wms.Api.Dto.StockIn.StockInCreateUpdate;
using Wms.Api.Dto.StockIn.StockInDetails;
using Wms.Api.Entities;

namespace Wms.Api.Profiles;

public class StockInProfile : Profile
{
    public StockInProfile()
    {
        #region DetailsV12Dto
        CreateMap<StockIn, StockInDetailsDto>()
            .ForMember(dest => dest.StockInItems, opt => opt.MapFrom(src => src.StockInItems));

        CreateMap<StockInItem, StockInItemDetailsDto>()
            .ForMember(dest => dest.ProductCode, opt => opt.MapFrom(src => src.Product != null ? src.Product.ProductCode : null))
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.ProductCode : null));
        #endregion

        #region CreateUpdateV12Dto
        CreateMap<StockInCreateUpdateDto, StockIn>()
            .ForMember(dest => dest.StockInItems, opt => opt.MapFrom(src => src.StockInItems));

        CreateMap<StockInItemCreateUpdateDto, StockInItem>();
        #endregion

    }
}