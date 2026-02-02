using System;
using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto
{
    public abstract class PagedRequestAbstractDto
    { 
        public int Page { get; set; } = 1;
        [Range(1, 100000)]
        public int PageSize { get; set; } = 10;
    }
}