using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.Supplier.SupplierCreateUpdate;
using Wms.Api.Dto.Supplier.SupplierDetails;
using Wms.Api.Entities;

namespace Wms.Api.Profiles;

public class SupplierProfile : Profile
{
    public SupplierProfile()
    {
        #region DetailsDto
        CreateMap<Supplier, SupplierDetailsDto>();
        #endregion

        #region CreateUpdateDto
        CreateMap<SupplierCreateUpdateDto, Supplier>()
            .ForMember(dest => dest.SupplierCode, opt => opt.Ignore());
        #endregion

        CreateMap<Supplier, SelectOptionV12Dto>()
            .ForMember(x => x.Value, option => option.MapFrom(y => y.Id))
            .ForMember(x => x.Label, option => option.MapFrom(y => $"{y.Name} ({y.SupplierCode})"));
    }
}
