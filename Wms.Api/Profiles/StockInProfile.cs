using AutoMapper;
using Wms.Api.Dto.StockIn.StockInCreateUpdate;
using Wms.Api.Entities;

namespace Wms.Api.Profiles;

public class StockInProfile : Profile
{
    public StockInProfile()
    {
        #region DetailsV12Dto
        CreateMap<StockIn, StockInDetailsDto>();
        CreateMap<StockInItem, StockInItemDetailsDto>();
        #endregion 

        #region CreateUpdateV12Dto
        CreateMap<StockInCreateUpdateDto, StockIn>();
        CreateMap<StockInItemCreateUpdateDto, StockInItem>();
        #endregion

    }
}