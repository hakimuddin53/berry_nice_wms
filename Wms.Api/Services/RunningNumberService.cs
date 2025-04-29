using Microsoft.EntityFrameworkCore; 
using Wms.Api.Context;
using Wms.Api.Entities;
using Wms.Api.Model; 

namespace Wms.Api.Services
{
    public class RunningNumberService(ApplicationDbContext context) : IRunningNumberService
    {
        private readonly ApplicationDbContext _context = context;

        public async Task<string> GenerateRunningNumberAsync(OperationTypeEnum operationType)
        {
            string datePart = DateTime.Now.ToString("yyyyMMdd");

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var runningNumber = await _context.RunningNumbers
                    .FirstOrDefaultAsync(r => r.OperationType == operationType);

                if (runningNumber != null)
                {
                    // Increment the sequence number
                    runningNumber.CurrentSequence++;
                    _context.RunningNumbers.Update(runningNumber);
                }
                else
                {
                    // Create a new record with sequence 1
                    runningNumber = new RunningNumber
                    {
                        OperationType = operationType,
                        Date = datePart,
                        CurrentSequence = 1
                    };
                    await _context.RunningNumbers.AddAsync(runningNumber);
                }

                // Save changes and commit the transaction
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Return the formatted running number
                return $"{operationType}{runningNumber.CurrentSequence:D4}";
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
