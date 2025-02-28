import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import {
  SizeCreateUpdateDto,
  SizeDetailsDto,
  SizeSearchDto,
} from "interfaces/v12/size/size";
import React from "react";
import { guid } from "types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface ISizeService {
  getSizeById: (sizeId: string) => Promise<SizeDetailsDto>;
  searchSizes: (searchDto: any) => Promise<SizeDetailsDto[]>;
  countSizes: (searchDto: any) => Promise<number>;
  updateSize: (id: guid, size: SizeCreateUpdateDto) => Promise<any>;
  createSize: (size: SizeCreateUpdateDto) => Promise<string>;
  deleteSize: (sizeId: guid) => Promise<any>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
}

const SizeServiceContext = createContext({} as ISizeService);

export const SizeServiceProvider: React.FC<{
  children?: React.ReactNode;
  searchSizes?: any;
  countSizes?: any;
  updateSize?: any;
  createSize?: any;
  deleteSize?: any;
  getSizeById?: any;
  getSelectOptions?: any;
}> = (props) => {
  const getSizeById = async (sizeId: string) => {
    return await axios.get(`/size/${sizeId}`).then((res) => res.data);
  };

  const searchSizes = (searchDto: SizeSearchDto) => {
    return axios.post("/size/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countSizes = (searchDto: any) => {
    return axios.post("/size/count", searchDto).then((res) => res.data);
  };

  const updateSize = (id: guid, size: SizeCreateUpdateDto) => {
    return axios.put("/size/" + id, size).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createSize = (size: SizeCreateUpdateDto) => {
    return axios.post("/size/", size).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteSize = (sizeId: guid) => {
    return axios.delete("/size/" + sizeId).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const getSelectOptions = async (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => {
    return await axios
      .get(`/size/select-options`, {
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
    searchSizes: props.searchSizes || searchSizes,
    countSizes: props.countSizes || countSizes,
    updateSize: props.updateSize || updateSize,
    createSize: props.createSize || createSize,
    deleteSize: props.deleteSize || deleteSize,
    getSizeById: props.getSizeById || getSizeById,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
  };

  return (
    <SizeServiceContext.Provider value={value}>
      {props.children}
    </SizeServiceContext.Provider>
  );
};

export const useSizeService = () => {
  return useContext(SizeServiceContext);
};
