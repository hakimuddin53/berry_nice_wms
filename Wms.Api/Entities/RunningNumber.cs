using System.ComponentModel.DataAnnotations;
using Wms.Api.Model;

namespace Wms.Api.Entities
{
    public class RunningNumber
    {
        public int Id { get; set; } // Primary Key
        public OperationTypeEnum OperationType { get; set; }  
        public string Date { get; set; } = string.Empty;          
        public int CurrentSequence { get; set; }
    }
}
