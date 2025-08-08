import { StockOutCreateUpdateDto } from "interfaces/v12/stockout/stockOutCreateUpdate/stockOutCreateUpdateDto";
import { StockOutDetailsDto } from "interfaces/v12/stockout/stockOutDetails/stockOutDetailsDto";
import { StockOutSearchDto } from "interfaces/v12/stockout/stockOutSearch/stockOutSearchDto";
import React from "react";
import { guid } from "../types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IStockOutService {
  searchStockOuts: (searchDto: any) => Promise<StockOutDetailsDto[]>;
  countStockOuts: (searchDto: any) => Promise<number>;
  getStockOutById: (stockOutId: guid) => Promise<StockOutDetailsDto>;
  updateStockOut: (id: guid, stockOut: StockOutCreateUpdateDto) => Promise<any>;
  createStockOut: (stockOut: StockOutCreateUpdateDto) => Promise<string>;
  deleteStockOut: (stockOutId: guid) => Promise<any>;
  cancelOrder: (stockOutId: guid) => Promise<any>;
}

const StockOutServiceContext = createContext({} as IStockOutService);

export type StockOutServiceProviderProps = {
  children?: React.ReactNode;
  searchStockOuts?: any;
  countStockOuts?: any;
  getStockOutById?: any;
  updateStockOut?: any;
  createStockOut?: any;
  deleteStockOut?: any;
  cancelOrder?: any;
};
export const StockOutServiceProvider: React.FC<StockOutServiceProviderProps> = (
  props
) => {
  const searchStockOuts = (searchDto: StockOutSearchDto) => {
    return axios.post("/stock-out/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countStockOuts = (searchDto: any) => {
    return axios.post("/stock-out/count", searchDto).then((res) => res.data);
  };

  const getStockOutById = (stockOutId: guid) => {
    return axios
      .get<StockOutDetailsDto>("/stock-out/" + stockOutId)
      .then(async (res) => {
        return res.data;
      });
  };

  const updateStockOut = (id: guid, stockOut: StockOutCreateUpdateDto) => {
    return axios.put("/stock-out/" + id, stockOut).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createStockOut = (stockOut: StockOutCreateUpdateDto) => {
    return axios.post("/stock-out/", stockOut).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteStockOut = (stockOutId: guid) => {
    return axios.delete("/stock-out/" + stockOutId).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const cancelOrder = (stockOutId: guid) => {
    return axios
      .post("/stock-out/" + stockOutId + "/cancel")
      .then(async (res) => {
        let result = res.data;
        return result.id;
      });
  };

  const value = {
    searchStockOuts: props.searchStockOuts || searchStockOuts,
    countStockOuts: props.countStockOuts || countStockOuts,
    getStockOutById: props.getStockOutById || getStockOutById,
    updateStockOut: props.updateStockOut || updateStockOut,
    createStockOut: props.createStockOut || createStockOut,
    deleteStockOut: props.deleteStockOut || deleteStockOut,
    cancelOrder: props.cancelOrder || cancelOrder,
  };

  return (
    <StockOutServiceContext.Provider value={value}>
      {props.children}
    </StockOutServiceContext.Provider>
  );
};

export const useStockOutService = () => {
  return useContext(StockOutServiceContext);
};
