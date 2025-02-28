using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Wms.Api.Dto;
using Wms.Api.Repositories.Interface; 

namespace Wms.Api.Services
{
    public class Service<T> : IService<T> where T : class
    {
        private readonly IRepository<T> _repository;

        public Service(IRepository<T> repository)
        {
            _repository = repository;
        }

        public async Task<IQueryable<T>> GetAllAsync(Expression<Func<T, bool>>? predicate = null)
        {
            return await _repository.GetAllAsync(predicate);
        } 

        public async Task<T> GetByIdAsync(Guid id) => await _repository.GetByIdAsync(id);

        public async Task AddAsync(T entity) => await _repository.AddAsync(entity);

        public async Task UpdateAsync(T entity) => await _repository.UpdateAsync(entity);

        public async Task DeleteAsync(Guid id) => await _repository.DeleteAsync(id);

        public async Task<IQueryable<T>> GetPaginatedAsync(
                     Expression<Func<T, bool>>? predicate = null,
                     Paginator paginator = null)
        {
            // Get the base query from the repository
            var query = await _repository.GetAllAsync(predicate);

            // Apply pagination
            if (paginator != null)
            {
                query = query
                    .Skip((paginator.Page - 1) * paginator.PageSize)
                    .Take(paginator.PageSize);
            }

            return query;
        } 
    }
}
