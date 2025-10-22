import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import { InvoiceCreateUpdateDto } from "interfaces/v12/invoice/invoiceCreateUpdateDto";
import { InvoiceDetailsDto } from "interfaces/v12/invoice/invoiceDetailsDto";
import { InvoiceSearchDto } from "interfaces/v12/invoice/invoiceSearchDto";
import queryString from "query-string";
import React from "react";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IInvoiceService {
  searchInvoices: (
    searchDto: InvoiceSearchDto
  ) => Promise<PagedListDto<InvoiceDetailsDto>>;
  countInvoices: (searchDto: InvoiceSearchDto) => Promise<number>;
  getInvoiceById: (invoiceId: string) => Promise<InvoiceDetailsDto>;
  createInvoice: (
    invoice: InvoiceCreateUpdateDto
  ) => Promise<InvoiceDetailsDto>;
  updateInvoice: (id: string, invoice: InvoiceCreateUpdateDto) => Promise<void>;
  deleteInvoice: (invoiceId: string) => Promise<void>;
}

const InvoiceServiceContext = createContext({} as IInvoiceService);

export type InvoiceServiceProviderProps = {
  children?: React.ReactNode;
  searchInvoices?: (
    searchDto: InvoiceSearchDto
  ) => Promise<PagedListDto<InvoiceDetailsDto>>;
  countInvoices?: (searchDto: InvoiceSearchDto) => Promise<number>;
  getInvoiceById?: (invoiceId: string) => Promise<InvoiceDetailsDto>;
  createInvoice?: (
    invoice: InvoiceCreateUpdateDto
  ) => Promise<InvoiceDetailsDto>;
  updateInvoice?: (
    id: string,
    invoice: InvoiceCreateUpdateDto
  ) => Promise<void>;
  deleteInvoice?: (invoiceId: string) => Promise<void>;
};

export const InvoiceServiceProvider: React.FC<InvoiceServiceProviderProps> = (
  props
) => {
  const searchInvoices = (searchDto: InvoiceSearchDto) => {
    return axios.post("/invoice/search", searchDto).then((res) => res.data);
  };

  const countInvoices = (searchDto: InvoiceSearchDto) => {
    return axios.post("/invoice/count", searchDto).then((res) => res.data);
  };

  const getInvoiceById = (invoiceId: string) => {
    return axios
      .get<InvoiceDetailsDto>("/invoice/" + invoiceId)
      .then((res) => res.data);
  };

  const createInvoice = (invoice: InvoiceCreateUpdateDto) => {
    return axios
      .post<InvoiceDetailsDto>("/invoice", invoice)
      .then((res) => res.data);
  };

  const updateInvoice = (id: string, invoice: InvoiceCreateUpdateDto) => {
    return axios.put<void>("/invoice/" + id, invoice).then((res) => res.data);
  };

  const deleteInvoice = (invoiceId: string) => {
    return axios.delete<void>("/invoice/" + invoiceId).then((res) => res.data);
  };

  const value: IInvoiceService = {
    searchInvoices: props.searchInvoices || searchInvoices,
    countInvoices: props.countInvoices || countInvoices,
    getInvoiceById: props.getInvoiceById || getInvoiceById,
    createInvoice: props.createInvoice || createInvoice,
    updateInvoice: props.updateInvoice || updateInvoice,
    deleteInvoice: props.deleteInvoice || deleteInvoice,
  };

  return (
    <InvoiceServiceContext.Provider value={value}>
      {props.children}
    </InvoiceServiceContext.Provider>
  );
};

export const useInvoiceService = () => {
  return useContext(InvoiceServiceContext);
};
