import { StockAdjustmentCreateUpdateDto } from "interfaces/v12/stockAdjustment/stockAdjustmentCreateUpdate/stockAdjustmentCreateUpdateDto";
import { StockAdjustmentDetailsDto } from "interfaces/v12/stockAdjustment/stockAdjustmentDetails/stockAdjustmentDetailsDto";
import { StockAdjustmentSearchDto } from "interfaces/v12/stockAdjustment/stockAdjustmentSearch/stockAdjustmentSearchDto";
import React from "react";
import { guid } from "../types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IStockAdjustmentService {
  searchStockAdjustments: (
    searchDto: any
  ) => Promise<StockAdjustmentDetailsDto[]>;
  countStockAdjustments: (searchDto: any) => Promise<number>;
  getStockAdjustmentById: (
    stockAdjustmentId: guid
  ) => Promise<StockAdjustmentDetailsDto>;
  updateStockAdjustment: (
    id: guid,
    stockAdjustment: StockAdjustmentCreateUpdateDto
  ) => Promise<any>;
  createStockAdjustment: (
    stockAdjustment: StockAdjustmentCreateUpdateDto
  ) => Promise<string>;
  deleteStockAdjustment: (stockAdjustmentId: guid) => Promise<any>;
}

const StockAdjustmentServiceContext = createContext(
  {} as IStockAdjustmentService
);

export type StockAdjustmentServiceProviderProps = {
  children?: React.ReactNode;
  searchStockAdjustments?: any;
  countStockAdjustments?: any;
  getStockAdjustmentById?: any;
  updateStockAdjustment?: any;
  createStockAdjustment?: any;
  deleteStockAdjustment?: any;
};
export const StockAdjustmentServiceProvider: React.FC<
  StockAdjustmentServiceProviderProps
> = (props) => {
  const searchStockAdjustments = (searchDto: StockAdjustmentSearchDto) => {
    return axios.post("/stock-adjustment/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countStockAdjustments = (searchDto: any) => {
    return axios
      .post("/stock-adjustment/count", searchDto)
      .then((res) => res.data);
  };

  const getStockAdjustmentById = (stockAdjustmentId: guid) => {
    return axios
      .get<StockAdjustmentDetailsDto>("/stock-adjustment/" + stockAdjustmentId)
      .then(async (res) => {
        return res.data;
      });
  };

  const updateStockAdjustment = (
    id: guid,
    stockAdjustment: StockAdjustmentCreateUpdateDto
  ) => {
    return axios
      .put("/stock-adjustment/" + id, stockAdjustment)
      .then(async (res) => {
        let result = res.data;
        return result;
      });
  };

  const createStockAdjustment = (
    stockAdjustment: StockAdjustmentCreateUpdateDto
  ) => {
    return axios
      .post("/stock-adjustment/", stockAdjustment)
      .then(async (res) => {
        let result = res.data;
        return result.id;
      });
  };

  const deleteStockAdjustment = (stockAdjustmentId: guid) => {
    return axios
      .delete("/stock-adjustment/" + stockAdjustmentId)
      .then(async (res) => {
        let result = res.data;
        return result.id;
      });
  };

  const value = {
    searchStockAdjustments:
      props.searchStockAdjustments || searchStockAdjustments,
    countStockAdjustments: props.countStockAdjustments || countStockAdjustments,
    getStockAdjustmentById:
      props.getStockAdjustmentById || getStockAdjustmentById,
    updateStockAdjustment: props.updateStockAdjustment || updateStockAdjustment,
    createStockAdjustment: props.createStockAdjustment || createStockAdjustment,
    deleteStockAdjustment: props.deleteStockAdjustment || deleteStockAdjustment,
  };

  return (
    <StockAdjustmentServiceContext.Provider value={value}>
      {props.children}
    </StockAdjustmentServiceContext.Provider>
  );
};

export const useStockAdjustmentService = () => {
  return useContext(StockAdjustmentServiceContext);
};
