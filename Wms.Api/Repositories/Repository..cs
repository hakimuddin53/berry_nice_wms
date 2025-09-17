using Microsoft.EntityFrameworkCore;
using System;
using System.Linq.Expressions;
using Wms.Api.Context;
using Wms.Api.Repositories.Interface;

namespace Wms.Api.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly ApplicationDbContext _context;
        private readonly DbSet<T> _dbSet;

        public Repository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public Task<IQueryable<T>> GetAllAsync(Expression<Func<T, bool>>? predicate = null)
        {
            if (predicate != null)
            {
                return Task.FromResult(_dbSet.Where(predicate));
            }
            return Task.FromResult(_dbSet.AsQueryable());
        }

        public async Task<T> GetByIdAsync(object id) => await _dbSet.FindAsync(id);

        public async Task AddAsync(T entity, bool saveChanges = true)
        {
            await _dbSet.AddAsync(entity);
            if (saveChanges)
            {
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(object id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
