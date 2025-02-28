using System;
using System.Collections.Generic;
using System.Linq;

namespace Wms.Api.Dto
{
    public class PagedList<T> : List<T>
    {
        public int CurrentPage { get; private set; }
        public int PageSize { get; private set; }
        public PagedList(List<T> items, int pageNumber, int pageSize)
        {
            if (items.Count() > pageSize)
            {
                throw new Exception("PagedList Error: CurrentPageSize > PageSize");
            }
            PageSize = pageSize;
            CurrentPage = pageNumber;
            AddRange(items);
        }
    }

    public interface IPaginator
    {
        public int Page { get; }
        public int PageSize { get; } 
    }

    public class Paginator : IPaginator
    {
        public Paginator() { }
        public Paginator(int page, int pageSize)
        {
            Page = page;
            PageSize = pageSize;
        }

        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10; 
    }
}
