using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Claims;
using Wms.Api.Context;
using Wms.Api.Dto.Logbook;
using Wms.Api.Dto.PagedList;
using Wms.Api.Entities;
using Wms.Api.Model;
using Wms.Api.Services;

namespace Wms.Api.Controllers
{
    [ApiController]
    [Route("api/logbook")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class LogbookController(
        ApplicationDbContext context,
        ICurrentUserService currentUserService) : ControllerBase
    {
        [HttpPost("search")]
        public async Task<IActionResult> SearchAsync([FromBody] LogbookSearchDto search)
        {
            search ??= new LogbookSearchDto();

            var query = context.LogbookEntries
                .Include(l => l.Product)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var term = search.Search.Trim();
                query = query.Where(l =>
                    l.Barcode.Contains(term) ||
                    l.UserName.Contains(term) ||
                    (l.Product != null && l.Product.ProductCode.Contains(term)) ||
                    (l.Product != null && l.Product.Model != null && l.Product.Model.Contains(term)));
            }

            var statusText = search.Status?.Trim();
            if (!string.IsNullOrWhiteSpace(statusText) &&
                Enum.TryParse<LogbookStatus>(statusText, true, out var statusFilter))
            {
                query = query.Where(l => l.Status == statusFilter);
            }

            if (search.FromDateUtc.HasValue)
            {
                query = query.Where(l => l.DateUtc >= search.FromDateUtc.Value);
            }

            if (search.ToDateUtc.HasValue)
            {
                query = query.Where(l => l.DateUtc <= search.ToDateUtc.Value);
            }

            var ordered = query
                .OrderByDescending(l => l.CreatedAt)
                .ThenByDescending(l => l.DateUtc);

            var totalCount = await ordered.CountAsync();

            var items = await ordered
                .Skip((search.Page - 1) * search.PageSize)
                .Take(search.PageSize)
                .ToListAsync();

            var dtoItems = items.Select(MapToDetails).ToList();

            var paged = new PagedListDto<LogbookDetailsDto>
            {
                CurrentPage = search.Page,
                PageSize = search.PageSize,
                TotalCount = totalCount,
                Data = dtoItems
            };

            return Ok(paged);
        }

        [HttpPost("available")]
        public async Task<IActionResult> AvailableAsync([FromBody] LogbookSearchDto search)
        {
            search ??= new LogbookSearchDto();

            var query = BuildAvailableQuery(search);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.StatusChangedAt)
                .ThenByDescending(x => x.ProductCode)
                .Skip((search.Page - 1) * search.PageSize)
                .Take(search.PageSize)
                .ToListAsync();

            var paged = new PagedListDto<LogbookAvailabilityDto>
            {
                CurrentPage = search.Page,
                PageSize = search.PageSize,
                TotalCount = totalCount,
                Data = items
            };

            return Ok(paged);
        }

        [HttpPost("available-count")]
        public async Task<IActionResult> AvailableCountAsync([FromBody] LogbookSearchDto search)
        {
            search ??= new LogbookSearchDto();

            var query = BuildAvailableQuery(search);
            var count = await query.CountAsync();
            return Ok(count);
        }

        [HttpPost("count")]
        public async Task<IActionResult> CountAsync([FromBody] LogbookSearchDto search)
        {
            search ??= new LogbookSearchDto();

            var query = context.LogbookEntries.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var term = search.Search.Trim();
                query = query.Where(l =>
                    l.Barcode.Contains(term) ||
                    l.UserName.Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(search.Status) &&
                Enum.TryParse<LogbookStatus>(search.Status, true, out var statusFilter))
            {
                query = query.Where(l => l.Status == statusFilter);
            }

            if (search.FromDateUtc.HasValue)
            {
                query = query.Where(l => l.DateUtc >= search.FromDateUtc.Value);
            }

            if (search.ToDateUtc.HasValue)
            {
                query = query.Where(l => l.DateUtc <= search.ToDateUtc.Value);
            }

            var count = await query.CountAsync();
            return Ok(count);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var entry = await context.LogbookEntries
                .Include(l => l.Product)
                .Include(l => l.StatusHistory)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (entry == null)
            {
                return NotFound();
            }

            return Ok(MapToDetails(entry));
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] LogbookCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var status = ParseStatus(dto.Status) ?? LogbookStatus.OUT;
            var dateUtc = dto.DateUtc ?? DateTime.UtcNow;
            var userId = currentUserService.UserId();
            var userName = ResolveUserName(dto.UserName);

            Guid? resolvedProductId = dto.ProductId == Guid.Empty ? null : dto.ProductId;
            if (resolvedProductId == null)
            {
                var productByCode = await context.Products
                    .Where(p => p.ProductCode == dto.Barcode.Trim())
                    .Select(p => new { p.ProductId })
                    .FirstOrDefaultAsync();
                if (productByCode != null)
                {
                    resolvedProductId = productByCode.ProductId;
                }
            }

            var statusChangedAt = dto.DateUtc ?? DateTime.UtcNow;
            var entity = new LogbookEntry
            {
                Id = Guid.NewGuid(),
                DateUtc = dateUtc,
                Barcode = dto.Barcode.Trim(),
                ProductId = resolvedProductId,
                UserName = userName,
                Purpose = string.IsNullOrWhiteSpace(dto.Purpose) ? null : dto.Purpose.Trim(),
                Status = status,
                StatusChangedAt = statusChangedAt,
                CreatedById = Guid.TryParse(userId, out var uid) ? uid : Guid.Empty,
                CreatedAt = DateTime.UtcNow
            };

            context.LogbookEntries.Add(entity);
            context.LogbookStatusHistories.Add(new LogbookStatusHistory
            {
                Id = Guid.NewGuid(),
                LogbookEntryId = entity.Id,
                Status = entity.Status,
                Remark = entity.Purpose,
                UserName = entity.UserName,
                ChangedAt = statusChangedAt
            });
            await context.SaveChangesAsync();

            return Ok(MapToDetails(entity));
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateAsync(Guid id, [FromBody] LogbookUpdateDto dto)
        {
            var entry = await context.LogbookEntries.FirstOrDefaultAsync(l => l.Id == id);
            if (entry == null)
            {
                return NotFound();
            }

            var statusChanged = false;
            var remarkChanged = false;

            if (!string.IsNullOrWhiteSpace(dto.UserName))
            {
                entry.UserName = dto.UserName.Trim();
            }

            if (dto.DateUtc.HasValue)
            {
                entry.DateUtc = dto.DateUtc.Value;
            }

            if (!string.IsNullOrWhiteSpace(dto.Purpose))
            {
                var trimmed = dto.Purpose.Trim();
                if (!string.Equals(trimmed, entry.Purpose, StringComparison.Ordinal))
                {
                    entry.Purpose = trimmed;
                    remarkChanged = true;
                }
            }

            if (!string.IsNullOrWhiteSpace(dto.Status))
            {
                var parsed = ParseStatus(dto.Status);
                if (parsed.HasValue)
                {
                    if (parsed.Value != entry.Status)
                    {
                        entry.Status = parsed.Value;
                        entry.StatusChangedAt = DateTime.UtcNow;
                        statusChanged = true;
                    }
                }
            }

            var userId = currentUserService.UserId();
            if (Guid.TryParse(userId, out var uid))
            {
                entry.ChangedById = uid;
            }
            entry.ChangedAt = DateTime.UtcNow;

            if (statusChanged || remarkChanged)
            {
                var history = new LogbookStatusHistory
                {
                    Id = Guid.NewGuid(),
                    LogbookEntryId = entry.Id,
                    Status = entry.Status,
                    Remark = entry.Purpose,
                    UserName = string.IsNullOrWhiteSpace(dto.UserName) ? entry.UserName : dto.UserName.Trim(),
                    ChangedAt = statusChanged ? entry.StatusChangedAt : DateTime.UtcNow
                };
                context.LogbookStatusHistories.Add(history);
            }

            await context.SaveChangesAsync();

            return Ok(MapToDetails(entry));
        }

        [HttpGet("{id:guid}/history")]
        public async Task<IActionResult> GetHistoryAsync(Guid id)
        {
            var exists = await context.LogbookEntries.AnyAsync(l => l.Id == id);
            if (!exists)
            {
                return NotFound();
            }

            var history = await context.LogbookStatusHistories
                .Where(h => h.LogbookEntryId == id)
                .OrderByDescending(h => h.ChangedAt)
                .ToListAsync();

            return Ok(history.Select(MapToHistoryDto).ToList());
        }

        private static LogbookStatus? ParseStatus(string? status)
        {
            if (string.IsNullOrWhiteSpace(status)) return null;
            return Enum.TryParse<LogbookStatus>(status, true, out var parsed) ? parsed : null;
        }

        private string ResolveUserName(string? provided)
        {
            if (!string.IsNullOrWhiteSpace(provided))
            {
                return provided.Trim();
            }

            var user = HttpContext?.User;
            var email = user?.FindFirstValue(ClaimTypes.Email);
            if (!string.IsNullOrWhiteSpace(email))
            {
                return email;
            }

            var name = user?.Identity?.Name;
            if (!string.IsNullOrWhiteSpace(name))
            {
                return name;
            }

            return "System";
        }

        private IQueryable<LogbookAvailabilityDto> BuildAvailableQuery(LogbookSearchDto search)
        {
            var inventoryQuery =
                from inv in context.Inventories
                join product in context.Products on inv.ProductId equals product.ProductId
                select new { inv, product };

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var term = search.Search.Trim();
                inventoryQuery = inventoryQuery.Where(x =>
                    x.product.ProductCode.Contains(term) ||
                    (x.product.Model != null && x.product.Model.Contains(term)));
            }

            var latestInventoryIds = inventoryQuery
                .GroupBy(x => x.inv.ProductId)
                .Select(g => g
                    .OrderByDescending(x => x.inv.CreatedAt)
                    .ThenByDescending(x => x.inv.Id)
                    .Select(x => x.inv.Id)
                    .First());

            var latestInventoryQuery = inventoryQuery
                .Join(latestInventoryIds, row => row.inv.Id, id => id, (row, _) => row)
                .Where(row => row.inv.NewBalance > 0);

            var query = latestInventoryQuery
                .Select(row => new
                {
                    row.product.ProductId,
                    row.product.ProductCode,
                    row.product.Model,
                    row.product.CreatedDate,
                    Latest = context.LogbookEntries
                        .Where(l => l.ProductId == row.product.ProductId)
                        .OrderByDescending(l => l.StatusChangedAt)
                        .ThenByDescending(l => l.CreatedAt)
                        .Select(l => new
                        {
                            l.Status,
                            l.StatusChangedAt,
                            l.Purpose,
                            l.UserName,
                            l.Id
                        })
                        .FirstOrDefault()
                });

            var statusText = search.Status?.Trim();
            if (!string.IsNullOrWhiteSpace(statusText) &&
                Enum.TryParse<LogbookStatus>(statusText, true, out var statusFilter))
            {
                query = query.Where(x => x.Latest != null && x.Latest.Status == statusFilter);
            }

            return query.Select(x => new LogbookAvailabilityDto
            {
                ProductId = x.ProductId,
                ProductCode = x.ProductCode,
                ProductName = x.Model,
                UserName = x.Latest != null ? x.Latest.UserName : null,
                Remark = x.Latest != null ? x.Latest.Purpose : null,
                Status = x.Latest != null ? x.Latest.Status.ToString() : null,
                StatusChangedAt = x.Latest != null && x.Latest.StatusChangedAt != default ? x.Latest.StatusChangedAt : (DateTime?)null,
                LogbookEntryId = x.Latest != null ? x.Latest.Id : (Guid?)null
            });
        }

        private static LogbookDetailsDto MapToDetails(LogbookEntry entry)
        {
            var statusChangedAt = entry.StatusChangedAt == default
                ? entry.DateUtc
                : entry.StatusChangedAt;

            return new LogbookDetailsDto
            {
                Id = entry.Id,
                DateUtc = entry.DateUtc,
                Barcode = entry.Barcode,
                ProductId = entry.ProductId,
                ProductCode = entry.Product?.ProductCode ?? entry.Barcode,
                UserName = entry.UserName,
                Purpose = entry.Purpose,
                Status = entry.Status.ToString(),
                StatusChangedAt = statusChangedAt,
                History = entry.StatusHistory?
                    .OrderByDescending(h => h.ChangedAt)
                    .Select(MapToHistoryDto)
                    .ToList() ?? new List<LogbookStatusHistoryDto>()
            };
        }

        private static LogbookStatusHistoryDto MapToHistoryDto(LogbookStatusHistory history) =>
            new LogbookStatusHistoryDto
            {
                Id = history.Id,
                Status = history.Status.ToString(),
                Remark = history.Remark,
                UserName = history.UserName,
                ChangedAt = history.ChangedAt
            };
    }
}
