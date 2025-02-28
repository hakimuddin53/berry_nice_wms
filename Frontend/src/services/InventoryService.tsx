import {
  InventoryDetailsDto,
  InventorySearchDto,
} from "interfaces/v12/inventory/inventory";
import React from "react";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IInventoryService {
  getInventoryById: (inventoryId: string) => Promise<InventoryDetailsDto>;
  searchInventorys: (searchDto: any) => Promise<InventoryDetailsDto[]>;
  countInventorys: (searchDto: any) => Promise<number>;
}

const InventoryServiceContext = createContext({} as IInventoryService);

export const InventoryServiceProvider: React.FC<{
  children?: React.ReactNode;
  searchInventorys?: any;
  countInventorys?: any;

  getInventoryById?: any;
}> = (props) => {
  const getInventoryById = async (inventoryId: string) => {
    return await axios.get(`/inventory/${inventoryId}`).then((res) => res.data);
  };

  const searchInventorys = (searchDto: InventorySearchDto) => {
    return axios.post("/inventory/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countInventorys = (searchDto: any) => {
    return axios.post("/inventory/count", searchDto).then((res) => res.data);
  };

  const value = {
    searchInventorys: props.searchInventorys || searchInventorys,
    countInventorys: props.countInventorys || countInventorys,
    getInventoryById: props.getInventoryById || getInventoryById,
  };

  return (
    <InventoryServiceContext.Provider value={value}>
      {props.children}
    </InventoryServiceContext.Provider>
  );
};

export const useInventoryService = () => {
  return useContext(InventoryServiceContext);
};
