using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.Expense.ExpenseCreateUpdate;
using Wms.Api.Dto.Expense.ExpenseDetails;
using Wms.Api.Entities;

namespace Wms.Api.Profiles;

public class ExpenseProfile : Profile
{
    public ExpenseProfile()
    {
        #region DetailsDto
        CreateMap<Expense, ExpenseDetailsDto>();
        #endregion

        #region CreateUpdateDto
        CreateMap<ExpenseCreateUpdateDto, Expense>();
        #endregion

        CreateMap<Expense, SelectOptionV12Dto>()
            .ForMember(x => x.Value, option => option.MapFrom(y => y.Id))
            .ForMember(x => x.Label, option => option.MapFrom(y => $"{y.Description} ({y.Category})"));
    }
}