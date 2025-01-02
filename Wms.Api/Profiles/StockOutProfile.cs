using AutoMapper; 
using Wms.Api.Dto.StockOut.StockOutCreateUpdate;
using Wms.Api.Dto.StockOut.StockOutCreateUpdateDto;
using Wms.Api.Dto.StockOut.StockOutDetails;
using Wms.Api.Entities;

namespace Leitstand.Mapping.Profiles.v12_0;

public class StockOutProfile : Profile
{
    public StockOutProfile()
    {
        #region DetailsV12Dto
        CreateMap<StockOut, StockOutDetailsDto>();
        CreateMap<StockOutItem, StockOutItemDetailsDto>();
        #endregion 

        #region CreateUpdateV12Dto
        CreateMap<StockOutCreateUpdateDto, StockOut>();
        CreateMap<StockOutItemCreateUpdateDto, StockOutItem>();
        #endregion

    }
}