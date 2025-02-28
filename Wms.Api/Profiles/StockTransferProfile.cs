using AutoMapper;
using Wms.Api.Dto.StockTransfer.StockTransferCreateUpdateDto;
using Wms.Api.Dto.StockTransfer.StockTransferDetails;
using Wms.Api.Entities;

namespace Leitstand.Mapping.Profiles.v12_0;

public class StockTransferProfile : Profile
{
    public StockTransferProfile()
    {
        #region DetailsV12Dto
        CreateMap<StockTransfer, StockTransferDetailsDto>();
        CreateMap<StockTransferItem, StockTransferItemDetailsDto>();
        #endregion 

        #region CreateUpdateV12Dto
        CreateMap<StockTransferCreateUpdateDto, StockTransfer>();
        CreateMap<StockTransferItemCreateUpdateDto, StockTransferItem>();
        #endregion

    }
}