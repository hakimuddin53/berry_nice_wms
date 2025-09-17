using System.Linq.Expressions;
using Wms.Api.Dto;

namespace Wms.Api.Services
{
    public interface IService<T>
    {
        Task<IQueryable<T>> GetAllAsync(Expression<Func<T, bool>>? predicate = null);
        Task<T> GetByIdAsync(object id);
        Task AddAsync(T entity, bool saveChanges = true);
        Task UpdateAsync(T entity);
        Task DeleteAsync(object id);

        Task<IQueryable<T>> GetPaginatedAsync(
                     Expression<Func<T, bool>>? predicate = null,
                     Paginator? paginator = null);
    }
}
