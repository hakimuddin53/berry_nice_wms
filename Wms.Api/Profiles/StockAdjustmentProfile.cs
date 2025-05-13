using AutoMapper;
using Wms.Api.Dto.StockAdjustment.StockAdjustmentCreateUpdate;
using Wms.Api.Dto.StockAdjustment.StockAdjustmentCreateUpdateDto;
using Wms.Api.Dto.StockAdjustment.StockAdjustmentDetails;
using Wms.Api.Entities;

namespace Wms.Api.Profiles;

public class StockAdjustmentProfile : Profile
{
    public StockAdjustmentProfile()
    {
        #region DetailsV12Dto
        CreateMap<StockAdjustment, StockAdjustmentDetailsDto>();
        CreateMap<StockAdjustmentItem, StockAdjustmentItemDetailsDto>();
        #endregion 

        #region CreateUpdateV12Dto
        CreateMap<StockAdjustmentCreateUpdateDto, StockAdjustment>();
        CreateMap<StockAdjustmentItemCreateUpdateDto, StockAdjustmentItem>();
        #endregion

    }
}