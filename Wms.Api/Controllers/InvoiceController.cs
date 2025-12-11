using AutoMapper;
using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wms.Api.Context;
using Wms.Api.Dto;
using Wms.Api.Dto.Invoice.InvoiceCreateUpdate;
using Wms.Api.Dto.Invoice.InvoiceDetails;
using Wms.Api.Dto.Invoice.InvoiceSearch;
using Wms.Api.Dto.PagedList;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class InvoiceController(
        IService<Invoice> invoiceService,
        IMapper mapper,
        ApplicationDbContext context,
        IRunningNumberService runningNumberService,
        IInventoryService inventoryService)
        : ControllerBase
    {
        [HttpPost("search")]
        public async Task<IActionResult> SearchAsync([FromBody] InvoiceSearchDto searchDto)
        {
            searchDto ??= new InvoiceSearchDto();

            var query = await invoiceService.GetAllAsync(invoice =>
                   (string.IsNullOrWhiteSpace(searchDto.Search) ||
                       invoice.Number.Contains(searchDto.Search) ||
                       (invoice.CustomerName != null && invoice.CustomerName.Contains(searchDto.Search)) ||
                       (invoice.EOrderNumber != null && invoice.EOrderNumber.Contains(searchDto.Search)) ||
                       (invoice.PaymentReference != null && invoice.PaymentReference.Contains(searchDto.Search))) &&
                   (!searchDto.FromDate.HasValue || invoice.DateOfSale >= searchDto.FromDate.Value) &&
                   (!searchDto.ToDate.HasValue || invoice.DateOfSale <= searchDto.ToDate.Value));

            var ordered = query
                .OrderByDescending(i => i.CreatedAt)
                .ThenByDescending(i => i.Number);

            var skip = (searchDto.Page - 1) * searchDto.PageSize;
            var items = ordered.Skip(skip).Take(searchDto.PageSize).ToList();
            var pagedList = new PagedList<Invoice>(items, searchDto.Page, searchDto.PageSize);
            var dto = mapper.Map<PagedListDto<InvoiceDetailsDto>>(pagedList);
            await AssignWarehouseLabelsAsync(dto.Data);

            return Ok(dto);
        }

        [HttpPost("count")]
        public async Task<IActionResult> CountAsync([FromBody] InvoiceSearchDto searchDto)
        {
            searchDto ??= new InvoiceSearchDto();

            var query = await invoiceService.GetAllAsync(invoice =>
                   (string.IsNullOrWhiteSpace(searchDto.Search) ||
                       invoice.Number.Contains(searchDto.Search) ||
                       (invoice.CustomerName != null && invoice.CustomerName.Contains(searchDto.Search)) ||
                       (invoice.EOrderNumber != null && invoice.EOrderNumber.Contains(searchDto.Search)) ||
                       (invoice.PaymentReference != null && invoice.PaymentReference.Contains(searchDto.Search))) &&
                   (!searchDto.FromDate.HasValue || invoice.DateOfSale >= searchDto.FromDate.Value) &&
                   (!searchDto.ToDate.HasValue || invoice.DateOfSale <= searchDto.ToDate.Value));

            return Ok(query.Count());
        }

        [HttpGet("{id:guid}", Name = "GetInvoiceByIdAsync")]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var invoice = await context.Invoices
                .Include(i => i.InvoiceItems)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null)
            {
                return NotFound();
            }

            var dto = mapper.Map<InvoiceDetailsDto>(invoice);
            dto.SalesPersonName = await context.Users
                .Where(u => u.Id == invoice.SalesPersonId)
                .Select(u => u.Name)
                .FirstOrDefaultAsync();

            dto.SalesTypeName = await context.Lookups
                .Where(l => l.Id == invoice.SalesTypeId)
                .Select(l => l.Label)
                .FirstOrDefaultAsync();

            dto.PaymentTypeName = await context.Lookups
                .Where(l => l.Id == invoice.PaymentTypeId)
                .Select(l => l.Label)
                .FirstOrDefaultAsync();

            if (invoice.CustomerId.HasValue)
            {
                dto.CustomerName ??= await context.Customers
                    .Where(c => c.Id == invoice.CustomerId.Value)
                    .Select(c => c.Name)
                    .FirstOrDefaultAsync();
            }

            var warehouseId = invoice.WarehouseId ?? Guid.Empty;
            dto.WarehouseLabel = warehouseId == Guid.Empty
                ? string.Empty
                : await context.Lookups
                    .Where(l => l.Id == warehouseId)
                    .Select(l => l.Label)
                    .FirstOrDefaultAsync() ?? string.Empty;

            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] InvoiceCreateUpdateDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            if (createDto.WarehouseId == Guid.Empty)
            {
                return BadRequest(new { message = "Warehouse is required." });
            }

            var invoiceNumber = await runningNumberService.GenerateRunningNumberAsync(OperationTypeEnum.INVOICE);
            var invoice = mapper.Map<Invoice>(createDto);

            invoice.Id = Guid.NewGuid();
            invoice.Number = invoiceNumber;

            NormalizeInvoice(invoice);

            await invoiceService.AddAsync(invoice);
            await UpdateProductPricingFromInvoiceAsync(invoice.InvoiceItems);

            try
            {
                await inventoryService.InvoiceAsync(invoice);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            var dto = mapper.Map<InvoiceDetailsDto>(invoice);
            await AssignWarehouseLabelsAsync(new[] { dto });
            return CreatedAtRoute("GetInvoiceByIdAsync", new { id = invoice.Id }, dto);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateAsync(Guid id, [FromBody] InvoiceCreateUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            if (updateDto.WarehouseId == Guid.Empty)
            {
                return BadRequest(new { message = "Warehouse is required." });
            }

            var invoice = await context.Invoices
                .Include(i => i.InvoiceItems)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null)
            {
                return NotFound();
            }

            invoice.CustomerId = updateDto.CustomerId;
            invoice.CustomerName = updateDto.CustomerName;
            invoice.DateOfSale = updateDto.DateOfSale;
            invoice.SalesPersonId = updateDto.SalesPersonId;
            invoice.WarehouseId = updateDto.WarehouseId;
            invoice.EOrderNumber = updateDto.EOrderNumber;
            invoice.SalesTypeId = updateDto.SalesTypeId;
            invoice.PaymentTypeId = updateDto.PaymentTypeId;
            invoice.PaymentReference = updateDto.PaymentReference;
            invoice.Remark = updateDto.Remark;

            if (invoice.InvoiceItems != null && invoice.InvoiceItems.Count > 0)
            {
                context.InvoiceItems.RemoveRange(invoice.InvoiceItems);
            }

            var newItems = updateDto.InvoiceItems.Select(itemDto => new InvoiceItem
            {
                Id = Guid.NewGuid(),
                InvoiceId = invoice.Id,
                ProductId = itemDto.ProductId,
                ProductCode = itemDto.ProductCode,
                Description = itemDto.Description,
                PrimarySerialNumber = itemDto.PrimarySerialNumber,
                ManufactureSerialNumber = itemDto.ManufactureSerialNumber,
                Imei = itemDto.Imei,
                WarrantyDurationMonths = itemDto.WarrantyDurationMonths,
                UnitOfMeasure = itemDto.UnitOfMeasure,
                Quantity = itemDto.Quantity,
                UnitPrice = itemDto.UnitPrice,
                TotalPrice = itemDto.TotalPrice > 0 ? itemDto.TotalPrice : itemDto.UnitPrice * itemDto.Quantity,
                Status = itemDto.Status
            }).ToList();

            invoice.InvoiceItems = newItems;
            invoice.GrandTotal = newItems.Sum(i => i.TotalPrice);

            await context.SaveChangesAsync();
            await UpdateProductPricingFromInvoiceAsync(invoice.InvoiceItems);

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            var invoice = await context.Invoices
                .Include(i => i.InvoiceItems)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null)
            {
                return NotFound();
            }

            context.InvoiceItems.RemoveRange(invoice.InvoiceItems ?? Enumerable.Empty<InvoiceItem>());
            context.Invoices.Remove(invoice);
            await context.SaveChangesAsync();

            return NoContent();
        }

        private async Task UpdateProductPricingFromInvoiceAsync(IEnumerable<InvoiceItem>? items)
        {
            if (items == null)
            {
                return;
            }

            var productIds = items
                .Where(i => i.ProductId.HasValue && i.ProductId.Value != Guid.Empty)
                .Select(i => i.ProductId!.Value)
                .Distinct()
                .ToList();

            if (productIds.Count == 0)
            {
                return;
            }

            var products = await context.Products
                .Where(p => productIds.Contains(p.ProductId))
                .ToListAsync();

            foreach (var item in items)
            {
                if (!item.ProductId.HasValue || item.ProductId.Value == Guid.Empty)
                {
                    continue;
                }

                var product = products.FirstOrDefault(p => p.ProductId == item.ProductId.Value);
                if (product == null)
                {
                    continue;
                }

                // Use invoice selling price to keep price references current.
                product.RetailPrice = item.UnitPrice;
                product.DealerPrice ??= item.UnitPrice;
                product.AgentPrice ??= item.UnitPrice;
            }

            await context.SaveChangesAsync();
        }

        private static void NormalizeInvoice(Invoice invoice)
        {
            if (invoice.InvoiceItems == null)
            {
                invoice.InvoiceItems = new List<InvoiceItem>();
            }

            foreach (var item in invoice.InvoiceItems)
            {
                if (item.Id == Guid.Empty)
                {
                    item.Id = Guid.NewGuid();
                }

                item.InvoiceId = invoice.Id;
                item.TotalPrice = item.TotalPrice > 0 ? item.TotalPrice : item.UnitPrice * item.Quantity;
            }

            invoice.GrandTotal = invoice.InvoiceItems.Sum(i => i.TotalPrice);
        }

        private async Task AssignWarehouseLabelsAsync(IEnumerable<InvoiceDetailsDto> invoices)
        {
            if (invoices == null)
            {
                return;
            }

            var list = invoices.Where(i => i != null).ToList();
            if (list.Count == 0)
            {
                return;
            }

            var warehouseIds = list
                .Select(i => i.WarehouseId)
                .Where(id => id != Guid.Empty)
                .Distinct()
                .ToList();

            var lookupLabels = warehouseIds.Count == 0
                ? new Dictionary<Guid, string>()
                : await context.Lookups
                    .Where(l => warehouseIds.Contains(l.Id))
                    .ToDictionaryAsync(l => l.Id, l => l.Label);

            foreach (var dto in list)
            {
                dto.WarehouseLabel = lookupLabels.TryGetValue(dto.WarehouseId, out var label)
                    ? label
                    : string.Empty;
            }
        }
    }
}

