using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.PagedList;
using Wms.Api.Dto.StockTransfer.StockTransferCreateUpdateDto;
using Wms.Api.Dto.StockTransfer.StockTransferDetails;
using Wms.Api.Dto.StockTransfer.StockTransferSearch;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/stock-transfer")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class StockTransferController(
        IService<StockTransfer> service,
        IMapper autoMapperService,
        ApplicationDbContext context,
        IRunningNumberService runningNumberService,
        IInventoryService inventoryService)
        : ControllerBase
    {
        [HttpPost("search", Name = "SearchStockTransfersAsync")]
        public async Task<IActionResult> SearchStockTransfersAsync([FromBody] StockTransferSearchDto stockTransferSearch)
        {  
            var stockTransfers = await service.GetAllAsync(e => e.Number.Contains(stockTransferSearch.search));

            var result = stockTransfers.Skip((stockTransferSearch.Page - 1) * stockTransferSearch.PageSize).Take(stockTransferSearch.PageSize).ToList();
            PagedList<StockTransfer> pagedResult = new PagedList<StockTransfer>(result, stockTransferSearch.Page, stockTransferSearch.PageSize);

            var stockTransferDtos = autoMapperService.Map<PagedListDto<StockTransferDetailsDto>>(pagedResult); 
            return Ok(stockTransferDtos);
        }
         
        [HttpPost("count", Name = "CountStockTransfersAsync")]     
        public async Task<IActionResult> CountStockTransfersAsync([FromBody] StockTransferSearchDto stockTransferSearch)
        {
            var stockTransfers = await service.GetAllAsync(e => e.Number.Contains(stockTransferSearch.search));
             
            var stockTransferDtos = autoMapperService.Map<List<StockTransferDetailsDto>>(stockTransfers);
            return Ok(stockTransferDtos.Count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        { 
            var stockTransfer = await service.GetByIdAsync(id);
            if (stockTransfer == null)
                return NotFound();

            stockTransfer.StockTransferItems = context.StockTransferItems.Where(x => x.StockTransferId == stockTransfer.Id).ToList();

            var stockTransferDtos = autoMapperService.Map<StockTransferDetailsDto>(stockTransfer);
             
            foreach (var stockTransferItem in stockTransferDtos.StockTransferItems!)
            {
                stockTransferItem.Product = context.Products?.Where(x => x.Id == stockTransferItem.ProductId)?.FirstOrDefault()?.Name ?? "";
                stockTransferItem.FromWarehouse = context.Warehouses?.Where(x => x.Id == stockTransferItem.FromWarehouseId)?.FirstOrDefault()?.Name ?? "";
                stockTransferItem.ToWarehouse = context.Warehouses?.Where(x => x.Id == stockTransferItem.ToWarehouseId)?.FirstOrDefault()?.Name ?? "";
                stockTransferItem.FromLocation = context.Locations?.Where(x => x.Id == stockTransferItem.FromLocationId)?.FirstOrDefault()?.Name ?? "";
                stockTransferItem.ToLocation = context.Locations?.Where(x => x.Id == stockTransferItem.ToLocationId)?.FirstOrDefault()?.Name ?? "";
            }

            return Ok(stockTransferDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockTransferCreateUpdateDto stockTransferCreateUpdateDto)
        {   
            string stockTransferNumber = await runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.STOCKTRANSFER);
        
            stockTransferCreateUpdateDto.Number = stockTransferNumber;
            var stockTransferDtos = autoMapperService.Map<StockTransfer>(stockTransferCreateUpdateDto); 
             
            foreach (var item in stockTransferDtos?.StockTransferItems ?? [])
            {
                item.FromWarehouse = "";
                item.ToWarehouse = "";
                item.Product = "";
                item.FromLocation = "";
                item.ToLocation = "";
            } 

            await service.AddAsync(stockTransferDtos!);

            await inventoryService.StockTransferAsync(stockTransferDtos!);
             

            return CreatedAtAction(nameof(GetById), new { id = stockTransferDtos?.Id }, stockTransferDtos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] StockTransferCreateUpdateDto stockTransferCreateUpdate)
        {
            var stockTransfer = await service.GetByIdAsync(id);

            var stockTransferDtos = autoMapperService.Map<StockTransferDetailsDto>(stockTransfer);
            if (stockTransferDtos == null)
                return NotFound();

            autoMapperService.Map(stockTransferCreateUpdate, stockTransfer);

            await service.UpdateAsync(stockTransfer);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await service.DeleteAsync(id);
            return NoContent();
        }
    }
}
