using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/stock-transfer")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class StockTransferController(IInventoryService inventoryService) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> TransferAsync([FromBody] StockTransferRequest request)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            await inventoryService.StockTransferAsync(request);
            return NoContent();
        }
    }
}
