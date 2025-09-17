using System.Linq.Expressions;

namespace Wms.Api.Repositories.Interface
{
    public interface IRepository<T> where T : class
    {
        Task<IQueryable<T>> GetAllAsync(Expression<Func<T, bool>>? predicate = null);
        Task<T> GetByIdAsync(object id);
        Task AddAsync(T entity, bool saveChanges = true);
        Task UpdateAsync(T entity);
        Task DeleteAsync(object id);
    }
}
