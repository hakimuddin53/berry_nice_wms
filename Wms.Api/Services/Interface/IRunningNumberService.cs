using Wms.Api.Model;

namespace Wms.Api.Services
{
    public interface IRunningNumberService
    {
        Task<string> GenerateRunningNumberAsync(OperationTypeEnum operationType);
    }
}
