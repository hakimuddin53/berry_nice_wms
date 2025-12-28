import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import { StockTransferCreateDto } from "interfaces/v12/stockTransfer/stockTransferCreateDto";
import { StockTransferDetailsDto } from "interfaces/v12/stockTransfer/stockTransferDetailsDto";
import { StockTransferSearchDto } from "interfaces/v12/stockTransfer/stockTransferSearchDto";
import React from "react";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IStockTransferService {
  search: (
    dto: StockTransferSearchDto
  ) => Promise<PagedListDto<StockTransferDetailsDto>>;
  count: (dto: StockTransferSearchDto) => Promise<number>;
  create: (dto: StockTransferCreateDto) => Promise<{ number: string }>;
}

const StockTransferServiceContext = createContext({} as IStockTransferService);

export const StockTransferServiceProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const search = (dto: StockTransferSearchDto) =>
    axios.post("/stock-transfer/search", dto).then((res) => res.data);

  const count = (dto: StockTransferSearchDto) =>
    axios.post("/stock-transfer/count", dto).then((res) => res.data);

  const create = (dto: StockTransferCreateDto) =>
    axios.post("/stock-transfer", dto).then((res) => res.data);

  const value: IStockTransferService = { search, count, create };

  return (
    <StockTransferServiceContext.Provider value={value}>
      {children}
    </StockTransferServiceContext.Provider>
  );
};

export const useStockTransferService = () => {
  return useContext(StockTransferServiceContext);
};
