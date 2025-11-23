using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;


namespace Wms.Api.Converters;

public class PagedListConverter<TSource, TDestination> : ITypeConverter<PagedList<TSource>, PagedListDto<TDestination>> where TSource : class where TDestination : class
{
    public PagedListDto<TDestination> Convert(PagedList<TSource> source, PagedListDto<TDestination> destination, ResolutionContext context)
    {
        var collection = context.Mapper.Map<List<TSource>, List<TDestination>>(source);
        return new PagedListDto<TDestination>
        {
            Data = collection,
            CurrentPage = source.CurrentPage,
            PageSize = source.PageSize,
            TotalCount = source.Count
        };
    }
}
