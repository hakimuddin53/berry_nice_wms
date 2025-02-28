using AutoMapper; 
using Wms.Api.Dto.StockReservation.StockReservationCreateUpdate;
using Wms.Api.Dto.StockReservation.StockReservationDetails;
using Wms.Api.Entities;

namespace Leitstand.Mapping.Profiles.v12_0;

public class StockReservationProfile : Profile
{
    public StockReservationProfile()
    {
        #region DetailsV12Dto
        CreateMap<StockReservation, StockReservationDetailsDto>();
        CreateMap<StockReservationItem, StockReservationItemDetailsDto>();
        #endregion 

        #region CreateUpdateV12Dto
        CreateMap<StockReservationCreateUpdateDto, StockReservation>();
        CreateMap<StockReservationItemCreateUpdateDto, StockReservationItem>();
        #endregion

    }
}