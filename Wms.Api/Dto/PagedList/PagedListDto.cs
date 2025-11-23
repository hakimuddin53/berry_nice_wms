using System.Collections.Generic;

namespace Wms.Api.Dto.PagedList
{
    public class PagedListDto<T>
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public List<T> Data { get; set; }
    }
}
