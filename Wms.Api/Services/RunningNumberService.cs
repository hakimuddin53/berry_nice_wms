using Microsoft.EntityFrameworkCore; 
using Wms.Api.Context;
using Wms.Api.Entities;
using Wms.Api.Model; 

namespace Wms.Api.Services
{
    public class RunningNumberService(ApplicationDbContext context) : IRunningNumberService
    {
        public async Task<string> GenerateRunningNumberAsync(OperationTypeEnum operationType)
        {
            var now = DateTime.UtcNow;

            var datePart = now.ToString("yyyyMMdd");

            string operationPrefix = operationType switch
            {
                OperationTypeEnum.STOCKIN => "SI",
                OperationTypeEnum.STOCKRESERVATION => "SR",
                OperationTypeEnum.STOCKTRANSFER => "ST",
                OperationTypeEnum.PRODUCT => "P",
                OperationTypeEnum.STOCKADJUSTMENT => "SA",
                OperationTypeEnum.INVOICE => "INV",
                _ => throw new ArgumentOutOfRangeException(nameof(operationType), "Invalid operation type")
            };

            using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                var runningNumber = await context.RunningNumbers
                    .FirstOrDefaultAsync(r => r.OperationType == operationType && r.Date == datePart);

                if (runningNumber != null)
                {
                    // Increment the sequence number
                    runningNumber.CurrentSequence++;
                    context.RunningNumbers.Update(runningNumber);
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
                    await context.RunningNumbers.AddAsync(runningNumber);
                }

                // Save changes and commit the transaction
                await context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Return the formatted running number
                return $"{operationPrefix}{datePart}{runningNumber.CurrentSequence:D4}";
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
