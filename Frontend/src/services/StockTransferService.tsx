import { StockTransferCreateUpdateDto } from "interfaces/v12/stockTransfer/stockTransferCreateUpdate/stockTransferCreateUpdateDto";
import { StockTransferDetailsDto } from "interfaces/v12/stockTransfer/stockTransferDetails/stockTransferDetailsDto";
import { StockTransferSearchDto } from "interfaces/v12/stockTransfer/stockTransferSearch/stockTransferSearchDto";
import React from "react";
import { guid } from "../types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IStockTransferService {
  searchStockTransfers: (searchDto: any) => Promise<StockTransferDetailsDto[]>;
  countStockTransfers: (searchDto: any) => Promise<number>;
  getStockTransferById: (
    stockTransferId: guid
  ) => Promise<StockTransferDetailsDto>;
  updateStockTransfer: (
    id: guid,
    stockTransfer: StockTransferCreateUpdateDto
  ) => Promise<any>;
  createStockTransfer: (
    stockTransfer: StockTransferCreateUpdateDto
  ) => Promise<string>;
  deleteStockTransfer: (stockTransferId: guid) => Promise<any>;
}

const StockTransferServiceContext = createContext({} as IStockTransferService);

export type StockTransferServiceProviderProps = {
  children?: React.ReactNode;
  searchStockTransfers?: any;
  countStockTransfers?: any;
  getStockTransferById?: any;
  updateStockTransfer?: any;
  createStockTransfer?: any;
  deleteStockTransfer?: any;
};
export const StockTransferServiceProvider: React.FC<
  StockTransferServiceProviderProps
> = (props) => {
  const searchStockTransfers = (searchDto: StockTransferSearchDto) => {
    return axios.post("/stock-transfer/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countStockTransfers = (searchDto: any) => {
    return axios
      .post("/stock-transfer/count", searchDto)
      .then((res) => res.data);
  };

  const getStockTransferById = (stockTransferId: guid) => {
    return axios
      .get<StockTransferDetailsDto>("/stock-transfer/" + stockTransferId)
      .then(async (res) => {
        return res.data;
      });
  };

  const updateStockTransfer = (
    id: guid,
    stockTransfer: StockTransferCreateUpdateDto
  ) => {
    return axios
      .put("/stock-transfer/" + id, stockTransfer)
      .then(async (res) => {
        let result = res.data;
        return result;
      });
  };

  const createStockTransfer = (stockTransfer: StockTransferCreateUpdateDto) => {
    return axios.post("/stock-transfer/", stockTransfer).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteStockTransfer = (stockTransferId: guid) => {
    return axios
      .delete("/stock-transfer/" + stockTransferId)
      .then(async (res) => {
        let result = res.data;
        return result.id;
      });
  };

  const value = {
    searchStockTransfers: props.searchStockTransfers || searchStockTransfers,
    countStockTransfers: props.countStockTransfers || countStockTransfers,
    getStockTransferById: props.getStockTransferById || getStockTransferById,
    updateStockTransfer: props.updateStockTransfer || updateStockTransfer,
    createStockTransfer: props.createStockTransfer || createStockTransfer,
    deleteStockTransfer: props.deleteStockTransfer || deleteStockTransfer,
  };

  return (
    <StockTransferServiceContext.Provider value={value}>
      {props.children}
    </StockTransferServiceContext.Provider>
  );
};

export const useStockTransferService = () => {
  return useContext(StockTransferServiceContext);
};
