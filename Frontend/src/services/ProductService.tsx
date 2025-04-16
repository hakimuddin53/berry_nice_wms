import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { ProductCreateUpdateDto } from "interfaces/v12/product/productCreateUpdate/productCreateUpdateDto";
import { ProductDetailsDto } from "interfaces/v12/product/productDetails/productDetailsDto";
import { ProductSearchDto } from "interfaces/v12/product/productSearch/productSearchDto";
import React from "react";
import { guid } from "../types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IProductService {
  searchProducts: (searchDto: any) => Promise<ProductDetailsDto[]>;
  countProducts: (searchDto: any) => Promise<number>;
  getProductById: (productId: guid) => Promise<ProductDetailsDto>;
  updateProduct: (id: guid, product: ProductCreateUpdateDto) => Promise<any>;
  createProduct: (product: ProductCreateUpdateDto) => Promise<string>;
  deleteProduct: (productId: guid) => Promise<any>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
  bulkUploadProducts: (formData: FormData) => Promise<void>;
}

const ProductServiceContext = createContext({} as IProductService);

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

  const getProductById = (productId: guid) => {
    return axios
      .get<ProductDetailsDto>("/product/" + productId)
      .then(async (res) => {
        return res.data;
      });
  };

  const updateProduct = (id: guid, product: ProductCreateUpdateDto) => {
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

  const deleteProduct = (productId: guid) => {
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
