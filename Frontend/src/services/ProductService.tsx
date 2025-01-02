import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { ProductDetailsDto } from "interfaces/v12/product/productDetails/productDetailsDto";
import React from "react";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IProductService {
  getProductById: (ProductId: string) => Promise<ProductDetailsDto>;

  getSelectOptions: (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
}

const ProductServiceContext = createContext({} as IProductService);

export const ProductServiceProvider: React.FC<{
  children?: React.ReactNode;
  getProductById?: any;
  getSelectOptions?: any;
}> = (props) => {
  const getProductById = async (productId: string) => {
    return await axios.get(`/product/${productId}`).then((res) => res.data);
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

  const value = {
    getProductById: props.getProductById || getProductById,
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
