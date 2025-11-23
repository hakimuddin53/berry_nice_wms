using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.StockIn.StockInCreateUpdate
{
    public class StockInItemRemarkCreateUpdateDto
    {
        public Guid? Id { get; set; }

        public Guid? StockInItemId { get; set; }

        public Guid? ProductRemarkId { get; set; }

        public string? Remark { get; set; }
    }
}
