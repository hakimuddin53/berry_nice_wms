using AutoMapper;
using Wms.Api.Dto;
using Wms.Api.Dto.Product.ProductCreateUpdate;
using Wms.Api.Dto.Product.ProductDetails;
using Wms.Api.Entities;

namespace Leitstand.Mapping.Profiles.v12_0;

public class ProductProfile : Profile
{
    public ProductProfile()
    {
        #region DetailsV12Dto
        CreateMap<Product, ProductDetailsDto>()
            .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Label))
            .ForMember(dest => dest.Brand, opt => opt.MapFrom(src => src.Brand != null ? src.Brand.Label : null))
            .ForMember(dest => dest.Model, opt => opt.MapFrom(src => src.Model != null ? src.Model.Label : null))
            .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.Color != null ? src.Color.Label : null))
            .ForMember(dest => dest.Storage, opt => opt.MapFrom(src => src.Storage != null ? src.Storage.Label : null))
            .ForMember(dest => dest.Ram, opt => opt.MapFrom(src => src.Ram != null ? src.Ram.Label : null))
            .ForMember(dest => dest.Processor, opt => opt.MapFrom(src => src.Processor != null ? src.Processor.Label : null))
            .ForMember(dest => dest.ScreenSize, opt => opt.MapFrom(src => src.ScreenSize != null ? src.ScreenSize.Label : null));

        #endregion

        #region CreateUpdateV12Dto
        CreateMap<ProductCreateUpdateDto, Product>();
        #endregion

        CreateMap<Product, SelectOptionV12Dto>()
            .ForMember(x => x.Value, option => option.MapFrom(y => y.ProductId))
            .ForMember(x => x.Label, option => option.MapFrom(y => $"{y.Sku}"));

    }
}