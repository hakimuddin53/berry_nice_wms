import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import {
  LogbookCreateDto,
  LogbookAvailabilityDto,
  LogbookEntryDto,
  LogbookSearchDto,
  LogbookStatusHistoryDto,
  LogbookUpdateDto,
} from "interfaces/v12/logbook/logbookDto";
import React from "react";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface ILogbookService {
  search: (dto: LogbookSearchDto) => Promise<PagedListDto<LogbookEntryDto>>;
  count: (dto: LogbookSearchDto) => Promise<number>;
  searchAvailable: (
    dto: LogbookSearchDto
  ) => Promise<PagedListDto<LogbookAvailabilityDto>>;
  countAvailable: (dto: LogbookSearchDto) => Promise<number>;
  create: (dto: LogbookCreateDto) => Promise<LogbookEntryDto>;
  update: (id: string, dto: LogbookUpdateDto) => Promise<LogbookEntryDto>;
  getById: (id: string) => Promise<LogbookEntryDto>;
  getHistory: (id: string) => Promise<LogbookStatusHistoryDto[]>;
}

const LogbookServiceContext = createContext({} as ILogbookService);

export const LogbookServiceProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const search = (dto: LogbookSearchDto) =>
    axios.post("/logbook/search", dto).then((res) => res.data);

  const count = (dto: LogbookSearchDto) =>
    axios.post("/logbook/count", dto).then((res) => res.data);

  const searchAvailable = (dto: LogbookSearchDto) =>
    axios.post("/logbook/available", dto).then((res) => res.data);

  const countAvailable = (dto: LogbookSearchDto) =>
    axios.post("/logbook/available-count", dto).then((res) => res.data);

  const create = (dto: LogbookCreateDto) =>
    axios.post("/logbook", dto).then((res) => res.data);

  const update = (id: string, dto: LogbookUpdateDto) =>
    axios.put(`/logbook/${id}`, dto).then((res) => res.data);

  const getById = (id: string) =>
    axios.get(`/logbook/${id}`).then((res) => res.data);

  const getHistory = (id: string) =>
    axios.get(`/logbook/${id}/history`).then((res) => res.data);

  const value: ILogbookService = {
    search,
    count,
    searchAvailable,
    countAvailable,
    create,
    update,
    getById,
    getHistory,
  };

  return (
    <LogbookServiceContext.Provider value={value}>
      {children}
    </LogbookServiceContext.Provider>
  );
};

export const useLogbookService = () => useContext(LogbookServiceContext);
