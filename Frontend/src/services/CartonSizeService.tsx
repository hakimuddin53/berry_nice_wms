import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";

import {
  CartonSizeCreateUpdateDto,
  CartonSizeDetailsDto,
  CartonSizeSearchDto,
} from "interfaces/v12/cartonSize/cartonSize";
import React from "react";
import { guid } from "types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface ICartonSizeService {
  getCartonSizeById: (cartonSizeId: string) => Promise<CartonSizeDetailsDto>;
  searchCartonSizes: (searchDto: any) => Promise<CartonSizeDetailsDto[]>;
  countCartonSizes: (searchDto: any) => Promise<number>;
  updateCartonSize: (
    id: guid,
    cartonSize: CartonSizeCreateUpdateDto
  ) => Promise<any>;
  createCartonSize: (cartonSize: CartonSizeCreateUpdateDto) => Promise<string>;
  deleteCartonSize: (cartonSizeId: guid) => Promise<any>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
}

const CartonSizeServiceContext = createContext({} as ICartonSizeService);

export const CartonSizeServiceProvider: React.FC<{
  children?: React.ReactNode;
  searchCartonSizes?: any;
  countCartonSizes?: any;
  updateCartonSize?: any;
  createCartonSize?: any;
  deleteCartonSize?: any;
  getCartonSizeById?: any;
  getSelectOptions?: any;
}> = (props) => {
  const getCartonSizeById = async (cartonSizeId: string) => {
    return await axios
      .get(`/cartonSize/${cartonSizeId}`)
      .then((res) => res.data);
  };

  const searchCartonSizes = (searchDto: CartonSizeSearchDto) => {
    return axios.post("/cartonSize/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countCartonSizes = (searchDto: any) => {
    return axios.post("/cartonSize/count", searchDto).then((res) => res.data);
  };

  const updateCartonSize = (
    id: guid,
    cartonSize: CartonSizeCreateUpdateDto
  ) => {
    return axios.put("/cartonSize/" + id, cartonSize).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createCartonSize = (cartonSize: CartonSizeCreateUpdateDto) => {
    return axios.post("/cartonSize/", cartonSize).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteCartonSize = (cartonSizeId: guid) => {
    return axios.delete("/cartonSize/" + cartonSizeId).then(async (res) => {
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
      .get(`/cartonSize/select-options`, {
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
    searchCartonSizes: props.searchCartonSizes || searchCartonSizes,
    countCartonSizes: props.countCartonSizes || countCartonSizes,
    updateCartonSize: props.updateCartonSize || updateCartonSize,
    createCartonSize: props.createCartonSize || createCartonSize,
    deleteCartonSize: props.deleteCartonSize || deleteCartonSize,
    getCartonSizeById: props.getCartonSizeById || getCartonSizeById,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
  };

  return (
    <CartonSizeServiceContext.Provider value={value}>
      {props.children}
    </CartonSizeServiceContext.Provider>
  );
};

export const useCartonSizeService = () => {
  return useContext(CartonSizeServiceContext);
};
