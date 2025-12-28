import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import { StockTakeCreateDto } from "interfaces/v12/stockTake/stockTakeCreateDto";
import { StockTakeDetailsDto } from "interfaces/v12/stockTake/stockTakeDetailsDto";
import { StockTakeSearchDto } from "interfaces/v12/stockTake/stockTakeSearchDto";
import React from "react";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IStockTakeService {
  search: (
    dto: StockTakeSearchDto
  ) => Promise<PagedListDto<StockTakeDetailsDto>>;
  count: (dto: StockTakeSearchDto) => Promise<number>;
  create: (dto: StockTakeCreateDto) => Promise<StockTakeDetailsDto>;
}

const StockTakeServiceContext = createContext({} as IStockTakeService);

export const StockTakeServiceProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const search = (dto: StockTakeSearchDto) =>
    axios.post("/stock-take/search", dto).then((res) => res.data);

  const count = (dto: StockTakeSearchDto) =>
    axios.post("/stock-take/count", dto).then((res) => res.data);

  const create = (dto: StockTakeCreateDto) =>
    axios.post("/stock-take", dto).then((res) => res.data);

  const value: IStockTakeService = { search, count, create };

  return (
    <StockTakeServiceContext.Provider value={value}>
      {children}
    </StockTakeServiceContext.Provider>
  );
};

export const useStockTakeService = () => {
  return useContext(StockTakeServiceContext);
};
