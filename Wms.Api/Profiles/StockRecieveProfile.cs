using System;
using AutoMapper;
using Wms.Api.Dto.StockRecieve.StockRecieveCreateUpdate;
using Wms.Api.Dto.StockRecieve.StockRecieveDetails;
using Wms.Api.Entities;

namespace Wms.Api.Profiles;

public class StockRecieveProfile : Profile
{
    public StockRecieveProfile()
    {
        #region DetailsV12Dto
        CreateMap<StockRecieve, StockRecieveDetailsDto>()
            .ForMember(dest => dest.StockRecieveItems, opt => opt.MapFrom(src => src.StockRecieveItems));

        CreateMap<StockRecieveItem, StockRecieveItemDetailsDto>()
            .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
            .ForMember(dest => dest.ProductCode, opt => opt.MapFrom(src => src.Product != null ? src.Product.ProductCode : string.Empty))
            .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.Product != null ? src.Product.CategoryId : Guid.Empty))
            .ForMember(dest => dest.BrandId, opt => opt.MapFrom(src => src.Product != null ? src.Product.BrandId : null))
            .ForMember(dest => dest.Model, opt => opt.MapFrom(src => src.Product != null ? src.Product.Model : null))
            .ForMember(dest => dest.ColorId, opt => opt.MapFrom(src => src.Product != null ? src.Product.ColorId : null))
            .ForMember(dest => dest.StorageId, opt => opt.MapFrom(src => src.Product != null ? src.Product.StorageId : null))
            .ForMember(dest => dest.RamId, opt => opt.MapFrom(src => src.Product != null ? src.Product.RamId : null))
            .ForMember(dest => dest.ProcessorId, opt => opt.MapFrom(src => src.Product != null ? src.Product.ProcessorId : null))
            .ForMember(dest => dest.ScreenSizeId, opt => opt.MapFrom(src => src.Product != null ? src.Product.ScreenSizeId : null))
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.Model : null))
            .ForMember(dest => dest.PrimarySerialNumber, opt => opt.MapFrom(src => src.Product != null ? src.Product.PrimarySerialNumber : null))
            .ForMember(dest => dest.ManufactureSerialNumber, opt => opt.MapFrom(src => src.Product != null ? src.Product.ManufactureSerialNumber : null))
            .ForMember(dest => dest.Region, opt => opt.MapFrom(src => src.Product != null ? src.Product.Region : null))
            .ForMember(dest => dest.NewOrUsed, opt => opt.MapFrom(src => src.Product != null ? src.Product.NewOrUsed : null))
            .ForMember(dest => dest.RetailSellingPrice, opt => opt.MapFrom(src => src.Product != null ? src.Product.RetailPrice : null))
            .ForMember(dest => dest.DealerSellingPrice, opt => opt.MapFrom(src => src.Product != null ? src.Product.DealerPrice : null))
            .ForMember(dest => dest.AgentSellingPrice, opt => opt.MapFrom(src => src.Product != null ? src.Product.AgentPrice : null))
            .ForMember(dest => dest.Cost, opt => opt.MapFrom(src => src.Product != null ? src.Product.CostPrice : null))
            .ForMember(dest => dest.Remark, opt => opt.MapFrom(src => src.Remark))
            .ForMember(dest => dest.InternalRemark, opt => opt.MapFrom(src => src.InternalRemark));
        #endregion

        #region CreateUpdateV12Dto
        CreateMap<StockRecieveCreateUpdateDto, StockRecieve>()
            .ForMember(dest => dest.StockRecieveItems, opt => opt.MapFrom(src => src.StockRecieveItems));

        CreateMap<StockRecieveItemCreateUpdateDto, StockRecieveItem>()
            .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId ?? Guid.Empty))
            .ForMember(dest => dest.Remark, opt => opt.MapFrom(src => src.Remark))
            .ForMember(dest => dest.InternalRemark, opt => opt.MapFrom(src => src.InternalRemark))
            .ForMember(dest => dest.Product, opt => opt.Ignore());

        #endregion

    }
}

