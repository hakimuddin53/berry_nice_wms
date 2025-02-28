import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import {
  WarehouseCreateUpdateDto,
  WarehouseDetailsDto,
  WarehouseSearchDto,
} from "interfaces/v12/warehouse/warehouse";
import React from "react";
import { guid } from "types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IWarehouseService {
  getWarehouseById: (warehouseId: string) => Promise<WarehouseDetailsDto>;
  searchWarehouses: (searchDto: any) => Promise<WarehouseDetailsDto[]>;
  countWarehouses: (searchDto: any) => Promise<number>;
  updateWarehouse: (
    id: guid,
    warehouse: WarehouseCreateUpdateDto
  ) => Promise<any>;
  createWarehouse: (warehouse: WarehouseCreateUpdateDto) => Promise<string>;
  deleteWarehouse: (warehouseId: guid) => Promise<any>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
}

const WarehouseServiceContext = createContext({} as IWarehouseService);

export const WarehouseServiceProvider: React.FC<{
  children?: React.ReactNode;
  searchWarehouses?: any;
  countWarehouses?: any;
  updateWarehouse?: any;
  createWarehouse?: any;
  deleteWarehouse?: any;
  getWarehouseById?: any;
  getSelectOptions?: any;
}> = (props) => {
  const getWarehouseById = async (warehouseId: string) => {
    return await axios.get(`/warehouse/${warehouseId}`).then((res) => res.data);
  };

  const searchWarehouses = (searchDto: WarehouseSearchDto) => {
    return axios.post("/warehouse/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countWarehouses = (searchDto: any) => {
    return axios.post("/warehouse/count", searchDto).then((res) => res.data);
  };

  const updateWarehouse = (id: guid, warehouse: WarehouseCreateUpdateDto) => {
    return axios.put("/warehouse/" + id, warehouse).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createWarehouse = (warehouse: WarehouseCreateUpdateDto) => {
    return axios.post("/warehouse/", warehouse).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteWarehouse = (warehouseId: guid) => {
    return axios.delete("/warehouse/" + warehouseId).then(async (res) => {
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
      .get(`/warehouse/select-options`, {
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
    searchWarehouses: props.searchWarehouses || searchWarehouses,
    countWarehouses: props.countWarehouses || countWarehouses,
    updateWarehouse: props.updateWarehouse || updateWarehouse,
    createWarehouse: props.createWarehouse || createWarehouse,
    deleteWarehouse: props.deleteWarehouse || deleteWarehouse,
    getWarehouseById: props.getWarehouseById || getWarehouseById,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
  };

  return (
    <WarehouseServiceContext.Provider value={value}>
      {props.children}
    </WarehouseServiceContext.Provider>
  );
};

export const useWarehouseService = () => {
  return useContext(WarehouseServiceContext);
};
