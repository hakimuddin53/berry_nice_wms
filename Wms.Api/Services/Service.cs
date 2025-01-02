using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
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

        public async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>>? predicate = null)
        {
            return await _repository.GetAllAsync(predicate);
        }


        public async Task<T> GetByIdAsync(Guid id) => await _repository.GetByIdAsync(id);

        public async Task AddAsync(T entity) => await _repository.AddAsync(entity);

        public async Task UpdateAsync(T entity) => await _repository.UpdateAsync(entity);

        public async Task DeleteAsync(Guid id) => await _repository.DeleteAsync(id);
    }

}
