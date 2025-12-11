import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import { StockRecieveCreateUpdateDto } from "interfaces/v12/StockRecieve/StockRecieveCreateUpdate/StockRecieveCreateUpdateDto";
import { StockRecieveDetailsDto } from "interfaces/v12/StockRecieve/StockRecieveDetails/StockRecieveDetailsDto";
import queryString from "query-string";
import React from "react";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IStockRecieveService {
  searchStockRecieves: (searchDto: any) => Promise<StockRecieveDetailsDto[]>;
  countStockRecieves: (searchDto: any) => Promise<number>;
  getStockRecieveById: (
    StockRecieveId: string
  ) => Promise<StockRecieveDetailsDto>;
  updateStockRecieve: (
    id: string,
    StockRecieve: StockRecieveCreateUpdateDto
  ) => Promise<any>;
  createStockRecieve: (
    StockRecieve: StockRecieveCreateUpdateDto
  ) => Promise<string>;
  deleteStockRecieve: (StockRecieveId: string) => Promise<any>;
  getByParameters: (
    StockRecieveIds: string[],
    resultPage?: number,
    resultSize?: number
  ) => Promise<PagedListDto<StockRecieveDetailsDto>>;
}

const StockRecieveServiceContext = createContext({} as IStockRecieveService);

const getByParameters = (
  StockRecieveIds: string[],
  resultPage?: number,
  resultSize?: number
) => {
  return axios
    .get("/stock-receive", {
      params: { StockRecieveIds, page: resultPage, pageSize: resultSize },
      paramsSerializer: (params) => {
        return queryString.stringify(params);
      },
    })
    .then((res) => res.data);
};

export type StockRecieveServiceProviderProps = {
  children?: React.ReactNode;
  searchStockRecieves?: any;
  countStockRecieves?: any;
  getStockRecieveById?: any;
  updateStockRecieve?: any;
  createStockRecieve?: any;
  deleteStockRecieve?: any;
  getByParameters?: any;
};

export const StockRecieveServiceProvider: React.FC<
  StockRecieveServiceProviderProps
> = (props) => {
  const searchStockRecieves = (searchDto: any) => {
    return axios.post("/stock-receive/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countStockRecieves = (searchDto: any) => {
    return axios
      .post("/stock-receive/count", searchDto)
      .then((res) => res.data);
  };

  const getStockRecieveById = (StockRecieveId: string) => {
    return axios
      .get<StockRecieveDetailsDto>("/stock-receive/" + StockRecieveId)
      .then(async (res) => {
        return res.data;
      });
  };

  const updateStockRecieve = (
    id: string,
    StockRecieve: StockRecieveCreateUpdateDto
  ) => {
    return axios.put("/stock-receive/" + id, StockRecieve).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createStockRecieve = (StockRecieve: StockRecieveCreateUpdateDto) => {
    return axios.post("/stock-receive/", StockRecieve).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteStockRecieve = (StockRecieveId: string) => {
    return axios
      .delete("/stock-receive/" + StockRecieveId)
      .then(async (res) => {
        let result = res.data;
        return result.id;
      });
  };

  const value = {
    searchStockRecieves: props.searchStockRecieves || searchStockRecieves,
    countStockRecieves: props.countStockRecieves || countStockRecieves,
    getStockRecieveById: props.getStockRecieveById || getStockRecieveById,
    updateStockRecieve: props.updateStockRecieve || updateStockRecieve,
    createStockRecieve: props.createStockRecieve || createStockRecieve,
    deleteStockRecieve: props.deleteStockRecieve || deleteStockRecieve,
    getByParameters: props.getByParameters || getByParameters,
  };

  return (
    <StockRecieveServiceContext.Provider value={value}>
      {props.children}
    </StockRecieveServiceContext.Provider>
  );
};

export const useStockRecieveService = () => {
  return useContext(StockRecieveServiceContext);
};

export { getByParameters };
