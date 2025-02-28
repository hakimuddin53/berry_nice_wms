import { StockReservationCreateUpdateDto } from "interfaces/v12/stockReservation/stockReservationCreateUpdate/stockReservationCreateUpdateDto";
import { StockReservationDetailsDto } from "interfaces/v12/stockReservation/stockReservationDetails/stockReservationDetailsDto";
import { StockReservationSearchDto } from "interfaces/v12/stockReservation/stockReservationSearch/stockReservationSearchDto";
import React from "react";
import { guid } from "../types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IStockReservationService {
  searchStockReservations: (
    searchDto: any
  ) => Promise<StockReservationDetailsDto[]>;
  countStockReservations: (searchDto: any) => Promise<number>;
  getStockReservationById: (
    stockInId: guid
  ) => Promise<StockReservationDetailsDto>;
  updateStockReservation: (
    id: guid,
    stockIn: StockReservationCreateUpdateDto
  ) => Promise<any>;
  createStockReservation: (
    stockIn: StockReservationCreateUpdateDto
  ) => Promise<string>;
  deleteStockReservation: (stockInId: guid) => Promise<any>;
}

const StockReservationServiceContext = createContext(
  {} as IStockReservationService
);

export type StockReservationServiceProviderProps = {
  children?: React.ReactNode;
  searchStockReservations?: any;
  countStockReservations?: any;
  getStockReservationById?: any;
  updateStockReservation?: any;
  createStockReservation?: any;
  deleteStockReservation?: any;
};
export const StockReservationServiceProvider: React.FC<
  StockReservationServiceProviderProps
> = (props) => {
  const searchStockReservations = (searchDto: StockReservationSearchDto) => {
    return axios.post("/stock-in/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countStockReservations = (searchDto: any) => {
    return axios.post("/stock-in/count", searchDto).then((res) => res.data);
  };

  const getStockReservationById = (stockInId: guid) => {
    return axios
      .get<StockReservationDetailsDto>("/stock-in/" + stockInId)
      .then(async (res) => {
        return res.data;
      });
  };

  const updateStockReservation = (
    id: guid,
    stockIn: StockReservationCreateUpdateDto
  ) => {
    return axios.put("/stock-in/" + id, stockIn).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createStockReservation = (stockIn: StockReservationCreateUpdateDto) => {
    return axios.post("/stock-in/", stockIn).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteStockReservation = (stockInId: guid) => {
    return axios.delete("/stock-in/" + stockInId).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const value = {
    searchStockReservations:
      props.searchStockReservations || searchStockReservations,
    countStockReservations:
      props.countStockReservations || countStockReservations,
    getStockReservationById:
      props.getStockReservationById || getStockReservationById,
    updateStockReservation:
      props.updateStockReservation || updateStockReservation,
    createStockReservation:
      props.createStockReservation || createStockReservation,
    deleteStockReservation:
      props.deleteStockReservation || deleteStockReservation,
  };

  return (
    <StockReservationServiceContext.Provider value={value}>
      {props.children}
    </StockReservationServiceContext.Provider>
  );
};

export const useStockReservationService = () => {
  return useContext(StockReservationServiceContext);
};
