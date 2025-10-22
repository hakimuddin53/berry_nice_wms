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
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Model))
            .ForMember(dest => dest.StockInItemRemarks, opt => opt.MapFrom(src => src.StockInItemRemarks));

        CreateMap<StockInItemRemark, StockInItemRemarkDetailsDto>();
        #endregion

        #region CreateUpdateV12Dto
        CreateMap<StockInCreateUpdateDto, StockIn>()
            .ForMember(dest => dest.StockInItems, opt => opt.MapFrom(src => src.StockInItems));

        CreateMap<StockInItemCreateUpdateDto, StockInItem>()
            .ForMember(dest => dest.StockInItemRemarks, opt => opt.MapFrom(src => src.StockInItemRemarks));

        CreateMap<StockInItemRemarkCreateUpdateDto, StockInItemRemark>();
        #endregion

    }
}
