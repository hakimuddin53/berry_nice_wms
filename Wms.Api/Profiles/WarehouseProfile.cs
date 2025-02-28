using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.Warehouse;
using Wms.Api.Entities;

namespace Leitstand.Mapping.Profiles.v12_0;

public class WarehouseProfile : Profile
{
    public WarehouseProfile()
    {
        #region DetailsV12Dto
        CreateMap<Warehouse, WarehouseDetailsDto>(); 
        #endregion 

        #region CreateUpdateV12Dto
        CreateMap<WarehouseCreateUpdateDto, Warehouse>();
        #endregion

        CreateMap<Warehouse, SelectOptionV12Dto>()
        .ForMember(x => x.Value, option => option.MapFrom(y => y.Id))
        .ForMember(x => x.Label, option => option.MapFrom(y => y.Name));

    }
}