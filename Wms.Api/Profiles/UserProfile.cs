using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.Usere;
using Wms.Api.Entities;

namespace Wms.Api.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<ApplicationUser, UserDetailsDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.UserRoleId, opt => opt.MapFrom(src => src.UserRoleId));

            CreateMap<UserDetailsDto, ApplicationUser>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.UserRoleId, opt => opt.MapFrom(src => src.UserRoleId));

            CreateMap<ApplicationUser, SelectOptionV12Dto>()
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Label, opt => opt.MapFrom(src =>
                    string.IsNullOrWhiteSpace(src.Name) ? src.Email ?? string.Empty : src.Name));
        }
    }
}
