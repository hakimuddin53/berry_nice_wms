using System.ComponentModel.DataAnnotations;

namespace Wms.Api.Dto.StockRecieve.StockRecieveCreateUpdate
{
    public class StockRecieveItemRemarkCreateUpdateDto
    {
        public Guid? Id { get; set; }

        public Guid? StockRecieveItemId { get; set; }

        public Guid? ProductRemarkId { get; set; }

        public string? Remark { get; set; }
    }
}

