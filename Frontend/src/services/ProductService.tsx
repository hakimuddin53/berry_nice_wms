import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import { ProductCreateUpdateDto } from "interfaces/v12/product/productCreateUpdate/productCreateUpdateDto";
import { ProductDetailsDto } from "interfaces/v12/product/productDetails/productDetailsDto";
import { ProductSearchDto } from "interfaces/v12/product/productSearch/productSearchDto";
import queryString from "query-string";
import React from "react";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IProductService {
  searchProducts: (searchDto: any) => Promise<ProductDetailsDto[]>;
  countProducts: (searchDto: any) => Promise<number>;
  getProductById: (productId: string) => Promise<ProductDetailsDto>;
  updateProduct: (id: string, product: ProductCreateUpdateDto) => Promise<any>;
  createProduct: (product: ProductCreateUpdateDto) => Promise<string>;
  deleteProduct: (productId: string) => Promise<any>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
  bulkUploadProducts: (formData: FormData) => Promise<void>;
  getByParameters: (
    productIds: string[],
    resultPage?: number,
    resultSize?: number
  ) => Promise<PagedListDto<ProductDetailsDto>>;
}

const ProductServiceContext = createContext({} as IProductService);

const getByParameters = (
  productIds: string[],
  resultPage?: number,
  resultSize?: number
) => {
  return axios
    .get("/product", {
      params: { productIds, page: resultPage, pageSize: resultSize },
      paramsSerializer: (params) => {
        return queryString.stringify(params);
      },
    })
    .then((res) => res.data);
};

export type ProductServiceProviderProps = {
  children?: React.ReactNode;
  searchProducts?: any;
  countProducts?: any;
  getProductById?: any;
  updateProduct?: any;
  createProduct?: any;
  deleteProduct?: any;
  getSelectOptions?: any;
  bulkUploadProducts?: any;
  getByParameters?: any;
};
export const ProductServiceProvider: React.FC<ProductServiceProviderProps> = (
  props
) => {
  const searchProducts = (searchDto: ProductSearchDto) => {
    return axios.post("/product/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countProducts = (searchDto: any) => {
    return axios.post("/product/count", searchDto).then((res) => res.data);
  };

  const getSelectOptions = async (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => {
    return await axios
      .get(`/product/select-options`, {
        params: {
          searchString: label,
          page: resultPage,
          pageSize: resultSize,
          ids: ids ?? [],
        },
      })
      .then((res) => res.data.data);
  };

  const getProductById = (productId: string) => {
    return axios
      .get<ProductDetailsDto>("/product/" + productId)
      .then(async (res) => {
        return res.data;
      });
  };

  const updateProduct = (id: string, product: ProductCreateUpdateDto) => {
    return axios.put("/product/" + id, product).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createProduct = (product: ProductCreateUpdateDto) => {
    return axios.post("/product/", product).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteProduct = (productId: string) => {
    return axios.delete("/product/" + productId).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const bulkUploadProducts = async (formData: FormData): Promise<void> => {
    await axios.post("/product/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const value = {
    searchProducts: props.searchProducts || searchProducts,
    countProducts: props.countProducts || countProducts,
    getProductById: props.getProductById || getProductById,
    updateProduct: props.updateProduct || updateProduct,
    createProduct: props.createProduct || createProduct,
    deleteProduct: props.deleteProduct || deleteProduct,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
    bulkUploadProducts: props.bulkUploadProducts || bulkUploadProducts,
    getByParameters: props.getByParameters || getByParameters,
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

export { getByParameters };
