using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.Category;
using Wms.Api.Entities;

namespace Leitstand.Mapping.Profiles.v12_0;

public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        #region DetailsV12Dto
        CreateMap<Category, CategoryDetailsDto>(); 
        #endregion 

        #region CreateUpdateV12Dto
        CreateMap<CategoryCreateUpdateDto, Category>();
        #endregion

        CreateMap<Category, SelectOptionV12Dto>()
           .ForMember(x => x.Value, option => option.MapFrom(y => y.Id))
           .ForMember(x => x.Label, option => option.MapFrom(y => y.Name));

    }
}