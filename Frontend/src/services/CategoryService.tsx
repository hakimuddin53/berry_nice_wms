import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import {
  CategoryCreateUpdateDto,
  CategoryDetailsDto,
  CategorySearchDto,
} from "interfaces/v12/category/category";
import React from "react";
import { guid } from "types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface ICategoryService {
  getCategoryById: (categoryId: string) => Promise<CategoryDetailsDto>;
  searchCategorys: (searchDto: any) => Promise<CategoryDetailsDto[]>;
  countCategorys: (searchDto: any) => Promise<number>;
  updateCategory: (id: guid, category: CategoryCreateUpdateDto) => Promise<any>;
  createCategory: (category: CategoryCreateUpdateDto) => Promise<string>;
  deleteCategory: (categoryId: guid) => Promise<any>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultCategory: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
}

const CategoryServiceContext = createContext({} as ICategoryService);

export const CategoryServiceProvider: React.FC<{
  children?: React.ReactNode;
  searchCategorys?: any;
  countCategorys?: any;
  updateCategory?: any;
  createCategory?: any;
  deleteCategory?: any;
  getCategoryById?: any;
  getSelectOptions?: any;
}> = (props) => {
  const getCategoryById = async (categoryId: string) => {
    return await axios.get(`/category/${categoryId}`).then((res) => res.data);
  };

  const searchCategorys = (searchDto: CategorySearchDto) => {
    return axios.post("/category/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countCategorys = (searchDto: any) => {
    return axios.post("/category/count", searchDto).then((res) => res.data);
  };

  const updateCategory = (id: guid, category: CategoryCreateUpdateDto) => {
    return axios.put("/category/" + id, category).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createCategory = (category: CategoryCreateUpdateDto) => {
    return axios.post("/category/", category).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteCategory = (categoryId: guid) => {
    return axios.delete("/category/" + categoryId).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const getSelectOptions = async (
    label: string,
    resultPage: number,
    resultCategory: number,
    ids?: string[]
  ) => {
    return await axios
      .get(`/category/select-options`, {
        params: {
          searchString: label,
          page: resultPage,
          pageCategory: resultCategory,
          ids: ids ?? [],
        },
      })
      .then((res) => res.data.data);
  };

  const value = {
    searchCategorys: props.searchCategorys || searchCategorys,
    countCategorys: props.countCategorys || countCategorys,
    updateCategory: props.updateCategory || updateCategory,
    createCategory: props.createCategory || createCategory,
    deleteCategory: props.deleteCategory || deleteCategory,
    getCategoryById: props.getCategoryById || getCategoryById,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
  };

  return (
    <CategoryServiceContext.Provider value={value}>
      {props.children}
    </CategoryServiceContext.Provider>
  );
};

export const useCategoryService = () => {
  return useContext(CategoryServiceContext);
};
