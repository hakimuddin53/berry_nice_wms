import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import { SupplierCreateUpdateDto } from "interfaces/v12/supplier/supplierCreateUpdate/supplierCreateUpdateDto";
import {
  SupplierDetailsDto,
  SupplierFindByParametersDto,
} from "interfaces/v12/supplier/supplierDetails/supplierDetailsDto";
import { SupplierSearchDto } from "interfaces/v12/supplier/supplierSearch/supplierSearchDto";
import queryString from "query-string";
import React from "react";
import { guid } from "../types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface ISupplierService {
  searchSuppliers: (
    searchDto: SupplierSearchDto
  ) => Promise<SupplierDetailsDto[]>;
  countSuppliers: (searchDto: SupplierSearchDto) => Promise<number>;
  getSupplierById: (supplierId: guid) => Promise<SupplierDetailsDto>;
  updateSupplier: (id: guid, supplier: SupplierCreateUpdateDto) => Promise<any>;
  createSupplier: (supplier: SupplierCreateUpdateDto) => Promise<string>;
  deleteSupplier: (supplierId: guid) => Promise<any>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
  getByParameters: (
    supplierIds: guid[],
    resultPage?: number,
    resultSize?: number
  ) => Promise<PagedListDto<SupplierDetailsDto>>;
}

const SupplierServiceContext = createContext({} as ISupplierService);

const getByParameters = (
  supplierIds: guid[],
  resultPage?: number,
  resultSize?: number
) => {
  return axios
    .get("/supplier", {
      params: { supplierIds, page: resultPage, pageSize: resultSize },
      paramsSerializer: (params) => {
        return queryString.stringify(params);
      },
    })
    .then((res) => res.data);
};

export type SupplierServiceProviderProps = {
  children?: React.ReactNode;
  searchSuppliers?: any;
  countSuppliers?: any;
  getSupplierById?: any;
  updateSupplier?: any;
  createSupplier?: any;
  deleteSupplier?: any;
  getSelectOptions?: any;
  getByParameters?: any;
};

export const SupplierServiceProvider: React.FC<SupplierServiceProviderProps> = (
  props
) => {
  const searchSuppliers = (searchDto: SupplierSearchDto) => {
    return axios.post("/supplier/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countSuppliers = (searchDto: SupplierSearchDto) => {
    return axios.post("/supplier/count", searchDto).then((res) => res.data);
  };

  const getSelectOptions = async (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => {
    return await axios
      .get(`/supplier/select-options`, {
        params: {
          searchString: label,
          page: resultPage,
          pageSize: resultSize,
          ids: ids ?? [],
        },
      })
      .then((res) => res.data.data);
  };

  const getSupplierById = (supplierId: guid) => {
    return axios
      .get<SupplierDetailsDto>("/supplier/" + supplierId)
      .then(async (res) => {
        return res.data;
      });
  };

  const updateSupplier = (id: guid, supplier: SupplierCreateUpdateDto) => {
    return axios.put("/supplier/" + id, supplier).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createSupplier = (supplier: SupplierCreateUpdateDto) => {
    return axios.post("/supplier/", supplier).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteSupplier = (supplierId: guid) => {
    return axios.delete("/supplier/" + supplierId).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const value = {
    searchSuppliers: props.searchSuppliers || searchSuppliers,
    countSuppliers: props.countSuppliers || countSuppliers,
    getSupplierById: props.getSupplierById || getSupplierById,
    updateSupplier: props.updateSupplier || updateSupplier,
    createSupplier: props.createSupplier || createSupplier,
    deleteSupplier: props.deleteSupplier || deleteSupplier,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
    getByParameters: props.getByParameters || getByParameters,
  };

  return (
    <SupplierServiceContext.Provider value={value}>
      {props.children}
    </SupplierServiceContext.Provider>
  );
};

export const useSupplierService = () => {
  return useContext(SupplierServiceContext);
};

export { getByParameters };
