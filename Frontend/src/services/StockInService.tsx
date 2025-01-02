import { StockInCreateUpdateDto } from "interfaces/v12/stockin/stockInCreateUpdate/stockInCreateUpdateDto";
import { StockInDetailsDto } from "interfaces/v12/stockin/stockInDetails/stockInDetailsDto";
import { StockInSearchDto } from "interfaces/v12/stockin/stockInSearch/stockInSearchDto";
import React from "react";
import { guid } from "../types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IStockInService {
  searchStockIns: (searchDto: any) => Promise<StockInDetailsDto[]>;
  countStockIns: (searchDto: any) => Promise<number>;
  getStockInById: (stockInId: guid) => Promise<StockInDetailsDto>;
  updateStockIn: (id: guid, stockIn: StockInCreateUpdateDto) => Promise<any>;
  createStockIn: (stockIn: StockInCreateUpdateDto) => Promise<string>;
  deleteStockIn: (stockInId: guid) => Promise<any>;
}

const StockInServiceContext = createContext({} as IStockInService);

export type StockInServiceProviderProps = {
  children?: React.ReactNode;
  searchStockIns?: any;
  countStockIns?: any;
  getStockInById?: any;
  updateStockIn?: any;
  createStockIn?: any;
  deleteStockIn?: any;
};
export const StockInServiceProvider: React.FC<StockInServiceProviderProps> = (
  props
) => {
  const searchStockIns = (searchDto: StockInSearchDto) => {
    return axios.post("/stock-in/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countStockIns = (searchDto: any) => {
    return axios.post("/stock-in/count", searchDto).then((res) => res.data);
  };

  const getStockInById = (stockInId: guid) => {
    return axios
      .get<StockInDetailsDto>("/stock-in/" + stockInId)
      .then(async (res) => {
        return res.data;
      });
  };

  const updateStockIn = (id: guid, stockIn: StockInCreateUpdateDto) => {
    return axios.put("/stock-in/" + id, stockIn).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createStockIn = (stockIn: StockInCreateUpdateDto) => {
    return axios.post("/stock-in/", stockIn).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteStockIn = (stockInId: guid) => {
    return axios.delete("/stock-in/" + stockInId).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const value = {
    searchStockIns: props.searchStockIns || searchStockIns,
    countStockIns: props.countStockIns || countStockIns,
    getStockInById: props.getStockInById || getStockInById,
    updateStockIn: props.updateStockIn || updateStockIn,
    createStockIn: props.createStockIn || createStockIn,
    deleteStockIn: props.deleteStockIn || deleteStockIn,
  };

  return (
    <StockInServiceContext.Provider value={value}>
      {props.children}
    </StockInServiceContext.Provider>
  );
};

export const useStockInService = () => {
  return useContext(StockInServiceContext);
};
