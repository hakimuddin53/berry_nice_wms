import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import { ProductDetailsDto } from "interfaces/v12/product/productDetails/productDetailsDto";
import { ProductSearchDto } from "interfaces/v12/product/productSearch/productSearchDto";
import queryString from "query-string";
import React from "react";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IProductService {
  searchProducts: (
    searchDto: ProductSearchDto
  ) => Promise<PagedListDto<ProductDetailsDto>>;
  countProducts: (searchDto: ProductSearchDto) => Promise<number>;
  getProductById: (productId: string) => Promise<ProductDetailsDto>;
  getProductsByIds: (ids: string[]) => Promise<PagedListDto<ProductDetailsDto>>;
  getSelectOptions: (
    search: string,
    page: number,
    pageSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
}

const ProductServiceContext = createContext({} as IProductService);

export type ProductServiceProviderProps = {
  children?: React.ReactNode;
  searchProducts?: (
    searchDto: ProductSearchDto
  ) => Promise<PagedListDto<ProductDetailsDto>>;
  countProducts?: (searchDto: ProductSearchDto) => Promise<number>;
  getProductById?: (productId: string) => Promise<ProductDetailsDto>;
  getProductsByIds?: (
    ids: string[]
  ) => Promise<PagedListDto<ProductDetailsDto>>;
  getSelectOptions?: (
    search: string,
    page: number,
    pageSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
};

export const ProductServiceProvider: React.FC<ProductServiceProviderProps> = (
  props
) => {
  const searchProducts = (searchDto: ProductSearchDto) => {
    return axios.post("/product/search", searchDto).then((res) => res.data);
  };

  const countProducts = (searchDto: ProductSearchDto) => {
    return axios.post("/product/count", searchDto).then((res) => res.data);
  };

  const getProductById = (productId: string) => {
    return axios
      .get<ProductDetailsDto>("/product/" + productId)
      .then((res) => res.data);
  };

  const getProductsByIds = (ids: string[]) => {
    const pageSize = Math.max(1, ids.length);
    return axios
      .post<PagedListDto<ProductDetailsDto>>("/product/find-by-ids", {
        productIds: ids,
        page: 1,
        pageSize,
      })
      .then((res) => res.data);
  };

  const getSelectOptions = async (
    search: string,
    page: number,
    pageSize: number,
    ids?: string[]
  ) => {
    return await axios
      .get(`/product/select-options`, {
        params: {
          searchString: search,
          page,
          pageSize,
          ids: ids ?? [],
        },
        paramsSerializer: (params) => queryString.stringify(params),
      })
      .then((res) => res.data.data ?? res.data);
  };

  const value: IProductService = {
    searchProducts: props.searchProducts || searchProducts,
    countProducts: props.countProducts || countProducts,
    getProductById: props.getProductById || getProductById,
    getProductsByIds: props.getProductsByIds || getProductsByIds,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
  };

  return (
    <ProductServiceContext.Provider value={value}>
      {props.children}
    </ProductServiceContext.Provider>
  );
};

export const useProductService = () => {
  return useContext(ProductServiceContext);
};
