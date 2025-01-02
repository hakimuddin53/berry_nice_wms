import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { WarehouseDetailsDto } from "interfaces/v12/warehouse/warehouseDetails/warehouseDetailsDto";
import React from "react";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IWarehouseService {
  getWarehouseById: (warehouseId: string) => Promise<WarehouseDetailsDto>;

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
  getWarehouseById?: any;
  getSelectOptions?: any;
}> = (props) => {
  const getWarehouseById = async (warehouseId: string) => {
    return await axios.get(`/warehouse/${warehouseId}`).then((res) => res.data);
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
