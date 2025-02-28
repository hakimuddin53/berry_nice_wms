using AutoMapper;
using Wms.Api.Converters;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;

namespace Wms.Api.Profiles;

public class GeneralProfile : Profile
{
    public GeneralProfile()
    {
        CreateMap(typeof(PagedList<>), typeof(PagedListDto<>)).ConvertUsing(typeof(PagedListConverter<,>));
 
    }
}