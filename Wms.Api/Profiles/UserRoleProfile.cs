using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.UserRole;
using Wms.Api.Entities;
using Wms.Api.Model;

namespace Wms.Api.Profiles
{
    public class UserRoleProfile : Profile
    {
        public UserRoleProfile()
        {
            CreateMap<ApplicationRole, UserRoleDetailsDto>()
                   .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id))) // Note: This still assumes src.Id is never null and always a valid Guid string. Consider Guid.TryParse for more robustness if needed.
                   .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                   .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.DisplayName))
                    // Simplified mapping using helper methods
                    .ForMember(dest => dest.Module, opt => opt.MapFrom(src =>
                        MappingHelpers.ParseEnumList<ModuleEnum>(src.Module))) // Use helper
                    .ForMember(dest => dest.CartonSizeId, opt => opt.MapFrom(src =>
                        MappingHelpers.ParseGuidList(src.CartonSizeId))); // Use helper

            CreateMap<UserRoleDetailsDto, ApplicationRole>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.DisplayName))
                .ForMember(dest => dest.Module, opt => opt.MapFrom(src => string.Join(",", src.Module)))
                .ForMember(dest => dest.CartonSizeId, opt => opt.MapFrom(src => string.Join(",", src.CartonSizeId)));

            CreateMap<ApplicationRole, SelectOptionV12Dto>()
                .ForMember(x => x.Value, option => option.MapFrom(y => y.Id))
                .ForMember(x => x.Label, option => option.MapFrom(y => y.DisplayName));
        }
    }
}



public static class MappingHelpers
{
    /// <summary>
    /// Parses a comma-separated string into a list of Enums of type TEnum.
    /// Handles null/whitespace strings, trims entries, and skips invalid enum values.
    /// </summary>
    public static List<TEnum> ParseEnumList<TEnum>(string commaSeparatedString) where TEnum : struct, Enum
    {
        // Still check for null/whitespace inside the helper for robustness
        if (string.IsNullOrWhiteSpace(commaSeparatedString))
        {
            return new List<TEnum>();
        }

        return commaSeparatedString.Split(',')
            .Select(s => s.Trim()) // Trim whitespace
            .Where(s => !string.IsNullOrWhiteSpace(s)) // Filter out empty entries
            .Select(s => Enum.TryParse<TEnum>(s, true, out var parsedEnum) // TryParse (case-insensitive)
                ? (TEnum?)parsedEnum
                : null)
            .Where(e => e.HasValue) // Filter out failed parses
            .Select(e => e.Value) // Get the valid enum value
            .ToList();
    }

    /// <summary>
    /// Parses a comma-separated string into a list of Guids.
    /// Handles null/whitespace strings, trims entries, and skips invalid Guid values.
    /// </summary>
    public static List<Guid> ParseGuidList(string commaSeparatedString)
    {
        // Still check for null/whitespace inside the helper for robustness
        if (string.IsNullOrWhiteSpace(commaSeparatedString))
        {
            return new List<Guid>();
        }

        return commaSeparatedString.Split(',')
            .Select(s => s.Trim()) // Trim whitespace
            .Where(s => !string.IsNullOrWhiteSpace(s)) // Filter out empty entries
            .Select(s => Guid.TryParse(s, out var parsedGuid) // TryParse Guid
                ? (Guid?)parsedGuid
                : null)
            .Where(g => g.HasValue) // Filter out failed parses
            .Select(g => g.Value) // Get the valid Guid value
            .ToList();
    }
}