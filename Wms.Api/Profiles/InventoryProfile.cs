using AutoMapper; 
using Wms.Api.Dto.Inventory;
using Wms.Api.Entities;

namespace Leitstand.Mapping.Profiles.v12_0;

public class InventoryProfile : Profile
{
    public InventoryProfile()
    {
        #region DetailsV12Dto
        CreateMap<Inventory, InventoryDetailsDto>();
        #endregion


        CreateMap<Inventory, InventorySummaryDetailsDto>();
    }
}