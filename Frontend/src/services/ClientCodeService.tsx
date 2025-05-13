import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";

import {
  ClientCodeCreateUpdateDto,
  ClientCodeDetailsDto,
  ClientCodeSearchDto,
} from "interfaces/v12/clientCode/clientCode";
import React from "react";
import { guid } from "types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IClientCodeService {
  getClientCodeById: (clientCodeId: string) => Promise<ClientCodeDetailsDto>;
  searchClientCodes: (searchDto: any) => Promise<ClientCodeDetailsDto[]>;
  countClientCodes: (searchDto: any) => Promise<number>;
  updateClientCode: (
    id: guid,
    clientCode: ClientCodeCreateUpdateDto
  ) => Promise<any>;
  createClientCode: (clientCode: ClientCodeCreateUpdateDto) => Promise<string>;
  deleteClientCode: (clientCodeId: guid) => Promise<any>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
}

const ClientCodeServiceContext = createContext({} as IClientCodeService);

export const ClientCodeServiceProvider: React.FC<{
  children?: React.ReactNode;
  searchClientCodes?: any;
  countClientCodes?: any;
  updateClientCode?: any;
  createClientCode?: any;
  deleteClientCode?: any;
  getClientCodeById?: any;
  getSelectOptions?: any;
}> = (props) => {
  const getClientCodeById = async (clientCodeId: string) => {
    return await axios
      .get(`/client-code/${clientCodeId}`)
      .then((res) => res.data);
  };

  const searchClientCodes = (searchDto: ClientCodeSearchDto) => {
    return axios.post("/client-code/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countClientCodes = (searchDto: any) => {
    return axios.post("/client-code/count", searchDto).then((res) => res.data);
  };

  const updateClientCode = (
    id: guid,
    clientCode: ClientCodeCreateUpdateDto
  ) => {
    return axios.put("/client-code/" + id, clientCode).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createClientCode = (clientCode: ClientCodeCreateUpdateDto) => {
    return axios.post("/client-code/", clientCode).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteClientCode = (clientCodeId: guid) => {
    return axios.delete("/client-code/" + clientCodeId).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const getSelectOptions = async (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => {
    return await axios
      .get(`/client-code/select-options`, {
        params: {
          searchString: label,
          page: resultPage,
          pageSize: resultSize,
          ids: ids ?? [],
        },
      })
      .then((res) => res.data.data);
  };

  const value = {
    searchClientCodes: props.searchClientCodes || searchClientCodes,
    countClientCodes: props.countClientCodes || countClientCodes,
    updateClientCode: props.updateClientCode || updateClientCode,
    createClientCode: props.createClientCode || createClientCode,
    deleteClientCode: props.deleteClientCode || deleteClientCode,
    getClientCodeById: props.getClientCodeById || getClientCodeById,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
  };

  return (
    <ClientCodeServiceContext.Provider value={value}>
      {props.children}
    </ClientCodeServiceContext.Provider>
  );
};

export const useClientCodeService = () => {
  return useContext(ClientCodeServiceContext);
};
