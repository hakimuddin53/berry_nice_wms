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
             .ForMember(x => x.Category, option => option.MapFrom(y => y.CategoryId.ToString()))
             .ForMember(x => x.Size, option => option.MapFrom(y => y.SizeId.ToString()))
             .ForMember(x => x.Colour, option => option.MapFrom(y => y.ColourId.ToString()))
             .ForMember(x => x.Design, option => option.MapFrom(y => y.DesignId.ToString()))
             .ForMember(x => x.CartonSize, option => option.MapFrom(y => y.CartonSizeId.ToString()));

        #endregion 

        #region CreateUpdateV12Dto
        CreateMap<ProductCreateUpdateDto, Product>(); 
        #endregion

        CreateMap<Product, SelectOptionV12Dto>()
            .ForMember(x => x.Value, option => option.MapFrom(y => y.Id))
            .ForMember(x => x.Label, option => option.MapFrom(y => $"{y.Name} ({y.ItemCode})"));

    }
}