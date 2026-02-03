using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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
                .Include(l => l.LogbookStatus)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search.Search))
            {
                var term = search.Search.Trim();
                query = query.Where(l =>
                    l.Barcode.Contains(term) ||
                    l.UserName.Contains(term) ||
                    (l.Product != null && l.Product.ProductCode.Contains(term)) ||
                    (l.Product != null && l.Product.Model != null && l.Product.Model.Label.Contains(term)));
            }

            if (search.LogbookStatusId.HasValue && search.LogbookStatusId.Value != Guid.Empty)
            {
                var statusId = search.LogbookStatusId.Value;
                query = query.Where(l => l.LogbookStatusId == statusId);
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

            if (search.LogbookStatusId.HasValue && search.LogbookStatusId.Value != Guid.Empty)
            {
                var statusId = search.LogbookStatusId.Value;
                query = query.Where(l => l.LogbookStatusId == statusId);
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
                .Include(l => l.LogbookStatus)
                .Include(l => l.StatusHistory)
                    .ThenInclude(h => h.LogbookStatus)
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

            if (string.IsNullOrWhiteSpace(dto.UserName))
            {
                ModelState.AddModelError(nameof(dto.UserName), "User is required.");
                return ValidationProblem(ModelState);
            }

            if (!dto.LogbookStatusId.HasValue || dto.LogbookStatusId == Guid.Empty)
            {
                ModelState.AddModelError(nameof(dto.LogbookStatusId), "Status is required.");
                return ValidationProblem(ModelState);
            }

            var statusId = dto.LogbookStatusId.Value;
            var statusExists = await context.Lookups
                .AnyAsync(l => l.Id == statusId && l.GroupKey == LookupGroupKey.LogbookStatus);
            if (!statusExists)
            {
                ModelState.AddModelError(nameof(dto.LogbookStatusId), "Status not found.");
                return ValidationProblem(ModelState);
            }
            var dateUtc = dto.DateUtc ?? DateTime.UtcNow;
            var userId = currentUserService.UserId();
            var userName = dto.UserName.Trim();

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
                LogbookStatusId = statusId,
                StatusChangedAt = statusChangedAt,
                CreatedById = Guid.TryParse(userId, out var uid) ? uid : Guid.Empty,
                CreatedAt = DateTime.UtcNow
            };

            context.LogbookEntries.Add(entity);
            context.LogbookStatusHistories.Add(new LogbookStatusHistory
            {
                Id = Guid.NewGuid(),
                LogbookEntryId = entity.Id,
                LogbookStatusId = entity.LogbookStatusId,
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
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            if (string.IsNullOrWhiteSpace(dto.UserName))
            {
                ModelState.AddModelError(nameof(dto.UserName), "User is required.");
                return ValidationProblem(ModelState);
            }

            var entry = await context.LogbookEntries.FirstOrDefaultAsync(l => l.Id == id);
            if (entry == null)
            {
                return NotFound();
            }

            var statusChanged = false;
            var remarkChanged = false;
            var userChanged = false;

            var trimmedUserName = dto.UserName.Trim();
            if (!string.Equals(trimmedUserName, entry.UserName, StringComparison.Ordinal))
            {
                entry.UserName = trimmedUserName;
                userChanged = true;
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

            if (dto.LogbookStatusId.HasValue && dto.LogbookStatusId.Value != Guid.Empty)
            {
                var newStatusId = dto.LogbookStatusId.Value;
                var statusExists = await context.Lookups
                    .AnyAsync(l => l.Id == newStatusId && l.GroupKey == LookupGroupKey.LogbookStatus);
                if (!statusExists)
                {
                    ModelState.AddModelError(nameof(dto.LogbookStatusId), "Status not found.");
                    return ValidationProblem(ModelState);
                }
                if (newStatusId != entry.LogbookStatusId)
                {
                    entry.LogbookStatusId = newStatusId;
                    entry.StatusChangedAt = DateTime.UtcNow;
                    statusChanged = true;
                }
            }

            var userId = currentUserService.UserId();
            if (Guid.TryParse(userId, out var uid))
            {
                entry.ChangedById = uid;
            }
            entry.ChangedAt = DateTime.UtcNow;

            if (statusChanged || remarkChanged || userChanged)
            {
                var history = new LogbookStatusHistory
                {
                    Id = Guid.NewGuid(),
                    LogbookEntryId = entry.Id,
                    LogbookStatusId = entry.LogbookStatusId,
                    Remark = entry.Purpose,
                    UserName = entry.UserName,
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
                .Include(h => h.LogbookStatus)
                .OrderByDescending(h => h.ChangedAt)
                .ToListAsync();

            return Ok(history.Select(MapToHistoryDto).ToList());
        }

        private static string? NormalizeStatus(string? status)
        {
            if (string.IsNullOrWhiteSpace(status)) return null;
            return status.Trim().ToUpper();
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
                    (x.product.Model != null && x.product.Model.Label.Contains(term)));
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
                    ModelLabel = row.product.Model != null ? row.product.Model.Label : null,
                    row.product.CreatedDate,
                    Latest = context.LogbookEntries
                        .Where(l => l.ProductId == row.product.ProductId)
                        .OrderByDescending(l => l.StatusChangedAt)
                        .ThenByDescending(l => l.CreatedAt)
                        .Select(l => new
                        {
                            l.LogbookStatusId,
                            l.StatusChangedAt,
                            l.Purpose,
                            l.UserName,
                            l.Id
                        })
                        .FirstOrDefault()
                });

            if (search.LogbookStatusId.HasValue && search.LogbookStatusId.Value != Guid.Empty)
            {
                var statusId = search.LogbookStatusId.Value;
                query = query.Where(x => x.Latest != null && x.Latest.LogbookStatusId == statusId);
            }

            return query.Select(x => new LogbookAvailabilityDto
            {
                ProductId = x.ProductId,
                ProductCode = x.ProductCode,
                ProductName = x.ModelLabel,
                UserName = x.Latest != null ? x.Latest.UserName : null,
                Remark = x.Latest != null ? x.Latest.Purpose : null,
                LogbookStatusId = x.Latest != null ? x.Latest.LogbookStatusId : (Guid?)null,
                StatusLabel = x.Latest != null
                    ? context.Lookups.Where(l => l.Id == x.Latest.LogbookStatusId).Select(l => l.Label).FirstOrDefault()
                    : null,
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
                LogbookStatusId = entry.LogbookStatusId,
                StatusLabel = entry.LogbookStatus?.Label,
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
                LogbookStatusId = history.LogbookStatusId,
                StatusLabel = history.LogbookStatus?.Label,
                Remark = history.Remark,
                UserName = history.UserName,
                ChangedAt = history.ChangedAt
            };
    }
}
