import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import { CustomerCreateUpdateDto } from "interfaces/v12/customer/customerCreateUpdate/customerCreateUpdateDto";
import {
  CustomerDetailsDto,
  CustomerFindByParametersDto,
} from "interfaces/v12/customer/customerDetails/customerDetailsDto";
import { CustomerSearchDto } from "interfaces/v12/customer/customerSearch/customerSearchDto";
import queryString from "query-string";
import React from "react";
import { guid } from "../types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface ICustomerService {
  searchCustomers: (
    searchDto: CustomerSearchDto
  ) => Promise<CustomerDetailsDto[]>;
  countCustomers: (searchDto: CustomerSearchDto) => Promise<number>;
  getCustomerById: (customerId: guid) => Promise<CustomerDetailsDto>;
  updateCustomer: (id: guid, customer: CustomerCreateUpdateDto) => Promise<any>;
  createCustomer: (customer: CustomerCreateUpdateDto) => Promise<string>;
  deleteCustomer: (customerId: guid) => Promise<any>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
  getByParameters: (
    customerIds: guid[],
    resultPage?: number,
    resultSize?: number
  ) => Promise<PagedListDto<CustomerDetailsDto>>;
}

const CustomerServiceContext = createContext({} as ICustomerService);

const getByParameters = (
  customerIds: guid[],
  resultPage?: number,
  resultSize?: number
) => {
  return axios
    .get("/customer", {
      params: { customerIds, page: resultPage, pageSize: resultSize },
      paramsSerializer: (params) => {
        return queryString.stringify(params);
      },
    })
    .then((res) => res.data);
};

export type CustomerServiceProviderProps = {
  children?: React.ReactNode;
  searchCustomers?: any;
  countCustomers?: any;
  getCustomerById?: any;
  updateCustomer?: any;
  createCustomer?: any;
  deleteCustomer?: any;
  getSelectOptions?: any;
  getByParameters?: any;
};

export const CustomerServiceProvider: React.FC<CustomerServiceProviderProps> = (
  props
) => {
  const searchCustomers = (searchDto: CustomerSearchDto) => {
    return axios.post("/customer/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countCustomers = (searchDto: CustomerSearchDto) => {
    return axios.post("/customer/count", searchDto).then((res) => res.data);
  };

  const getSelectOptions = async (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => {
    return await axios
      .get(`/customer/select-options`, {
        params: {
          searchString: label,
          page: resultPage,
          pageSize: resultSize,
          ids: ids ?? [],
        },
      })
      .then((res) => res.data.data);
  };

  const getCustomerById = (customerId: guid) => {
    return axios
      .get<CustomerDetailsDto>("/customer/" + customerId)
      .then(async (res) => {
        return res.data;
      });
  };

  const updateCustomer = (id: guid, customer: CustomerCreateUpdateDto) => {
    return axios.put("/customer/" + id, customer).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createCustomer = (customer: CustomerCreateUpdateDto) => {
    return axios.post("/customer/", customer).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteCustomer = (customerId: guid) => {
    return axios.delete("/customer/" + customerId).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const value = {
    searchCustomers: props.searchCustomers || searchCustomers,
    countCustomers: props.countCustomers || countCustomers,
    getCustomerById: props.getCustomerById || getCustomerById,
    updateCustomer: props.updateCustomer || updateCustomer,
    createCustomer: props.createCustomer || createCustomer,
    deleteCustomer: props.deleteCustomer || deleteCustomer,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
    getByParameters: props.getByParameters || getByParameters,
  };

  return (
    <CustomerServiceContext.Provider value={value}>
      {props.children}
    </CustomerServiceContext.Provider>
  );
};

export const useCustomerService = () => {
  return useContext(CustomerServiceContext);
};

export { getByParameters };
