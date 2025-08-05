import { StockReservationCreateUpdateDto } from "interfaces/v12/stockReservation/stockReservationCreateUpdate/stockReservationCreateUpdateDto";
import {
  ActiveReservationItemDto,
  StockReservationDetailsDto,
} from "interfaces/v12/stockReservation/stockReservationDetails/stockReservationDetailsDto";
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
    stockReservationId: guid
  ) => Promise<StockReservationDetailsDto>;
  updateStockReservation: (
    id: guid,
    stockReservation: StockReservationCreateUpdateDto
  ) => Promise<any>;
  createStockReservation: (
    stockReservation: StockReservationCreateUpdateDto
  ) => Promise<string>;
  deleteStockReservation: (stockReservationId: guid) => Promise<any>;
  approveCancelStockReservation: (
    stockReservationId: guid,
    userEmail: string
  ) => Promise<any>;
  requestCancelStockReservation: (
    stockReservationId: guid,
    userEmail: string
  ) => Promise<any>;
  getActiveReservations: (productId: guid, warehouseId: guid) => Promise<any>;
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
  approveCancelStockReservation?: any;
  requestCancelStockReservation?: any;
  getActiveReservations?: any;
};
export const StockReservationServiceProvider: React.FC<
  StockReservationServiceProviderProps
> = (props) => {
  const getActiveReservations = (productId: guid, warehouseId: guid) => {
    return axios
      .get<ActiveReservationItemDto[]>("/stock-reservation/active", {
        params: { productId, warehouseId },
      })
      .then((res) => res.data);
  };

  const searchStockReservations = (searchDto: StockReservationSearchDto) => {
    return axios.post("/stock-reservation/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countStockReservations = (searchDto: any) => {
    return axios
      .post("/stock-reservation/count", searchDto)
      .then((res) => res.data);
  };

  const getStockReservationById = (stockReservationId: guid) => {
    return axios
      .get<StockReservationDetailsDto>(
        "/stock-reservation/" + stockReservationId
      )
      .then(async (res) => {
        return res.data;
      });
  };

  const updateStockReservation = (
    id: guid,
    stockReservation: StockReservationCreateUpdateDto
  ) => {
    return axios
      .put("/stock-reservation/" + id, stockReservation)
      .then(async (res) => {
        let result = res.data;
        return result;
      });
  };

  const createStockReservation = (
    stockReservation: StockReservationCreateUpdateDto
  ) => {
    return axios
      .post("/stock-reservation/", stockReservation)
      .then(async (res) => {
        let result = res.data;
        return result.id;
      });
  };

  const deleteStockReservation = (stockReservationId: guid) => {
    return axios
      .delete("/stock-reservation/" + stockReservationId)
      .then(async (res) => {
        let result = res.data;
        return result.id;
      });
  };

  const approveCancelStockReservation = (
    stockReservationId: guid,
    userEmail: string
  ) => {
    var dto: CancelRequestDto = {
      UserEmail: userEmail,
    };
    return axios.post(
      "/stock-reservation/" + stockReservationId + "/approve-cancel",
      dto
    );
  };
  const requestCancelStockReservation = (
    stockReservationId: guid,
    userEmail: string
  ) => {
    var dto: CancelRequestDto = {
      UserEmail: userEmail,
    };
    return axios.post(
      "/stock-reservation/" + stockReservationId + "/request-cancel",
      dto
    );
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
    approveCancelStockReservation:
      props.approveCancelStockReservation || approveCancelStockReservation,
    requestCancelStockReservation:
      props.requestCancelStockReservation || requestCancelStockReservation,
    getActiveReservations: props.getActiveReservations || getActiveReservations,
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

export interface CancelRequestDto {
  UserEmail: string;
}
