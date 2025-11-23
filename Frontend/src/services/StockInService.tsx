import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import { StockInCreateUpdateDto } from "interfaces/v12/stockIn/stockInCreateUpdate/stockInCreateUpdateDto";
import { StockInDetailsDto } from "interfaces/v12/stockIn/stockInDetails/stockInDetailsDto";
import queryString from "query-string";
import React from "react";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IStockInService {
  searchStockIns: (searchDto: any) => Promise<StockInDetailsDto[]>;
  countStockIns: (searchDto: any) => Promise<number>;
  getStockInById: (stockInId: string) => Promise<StockInDetailsDto>;
  updateStockIn: (id: string, stockIn: StockInCreateUpdateDto) => Promise<any>;
  createStockIn: (stockIn: StockInCreateUpdateDto) => Promise<string>;
  deleteStockIn: (stockInId: string) => Promise<any>;
  getByParameters: (
    stockInIds: string[],
    resultPage?: number,
    resultSize?: number
  ) => Promise<PagedListDto<StockInDetailsDto>>;
}

const StockInServiceContext = createContext({} as IStockInService);

const getByParameters = (
  stockInIds: string[],
  resultPage?: number,
  resultSize?: number
) => {
  return axios
    .get("/stock-in", {
      params: { stockInIds, page: resultPage, pageSize: resultSize },
      paramsSerializer: (params) => {
        return queryString.stringify(params);
      },
    })
    .then((res) => res.data);
};

export type StockInServiceProviderProps = {
  children?: React.ReactNode;
  searchStockIns?: any;
  countStockIns?: any;
  getStockInById?: any;
  updateStockIn?: any;
  createStockIn?: any;
  deleteStockIn?: any;
  getByParameters?: any;
};

export const StockInServiceProvider: React.FC<StockInServiceProviderProps> = (
  props
) => {
  const searchStockIns = (searchDto: any) => {
    return axios.post("/stock-in/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countStockIns = (searchDto: any) => {
    return axios.post("/stock-in/count", searchDto).then((res) => res.data);
  };

  const getStockInById = (stockInId: string) => {
    return axios
      .get<StockInDetailsDto>("/stock-in/" + stockInId)
      .then(async (res) => {
        return res.data;
      });
  };

  const updateStockIn = (id: string, stockIn: StockInCreateUpdateDto) => {
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

  const deleteStockIn = (stockInId: string) => {
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
    getByParameters: props.getByParameters || getByParameters,
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

export { getByParameters };
