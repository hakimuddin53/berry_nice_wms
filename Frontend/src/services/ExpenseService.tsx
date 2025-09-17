import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import { ExpenseCreateUpdateDto } from "interfaces/v12/expense/expenseCreateUpdate/expenseCreateUpdateDto";
import {
  ExpenseDetailsDto,
  ExpenseFindByParametersDto,
} from "interfaces/v12/expense/expenseDetails/expenseDetailsDto";
import { ExpenseSearchDto } from "interfaces/v12/expense/expenseSearch/expenseSearchDto";
import queryString from "query-string";
import React from "react";
import { guid } from "../types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IExpenseService {
  searchExpenses: (searchDto: ExpenseSearchDto) => Promise<ExpenseDetailsDto[]>;
  countExpenses: (searchDto: ExpenseSearchDto) => Promise<number>;
  getExpenseById: (expenseId: guid) => Promise<ExpenseDetailsDto>;
  updateExpense: (id: guid, expense: ExpenseCreateUpdateDto) => Promise<any>;
  createExpense: (expense: ExpenseCreateUpdateDto) => Promise<string>;
  deleteExpense: (expenseId: guid) => Promise<any>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
  getByParameters: (
    expenseIds: guid[],
    resultPage?: number,
    resultSize?: number
  ) => Promise<PagedListDto<ExpenseDetailsDto>>;
}

const ExpenseServiceContext = createContext({} as IExpenseService);

const getByParameters = (
  expenseIds: guid[],
  resultPage?: number,
  resultSize?: number
) => {
  return axios
    .get("/expense", {
      params: { expenseIds, page: resultPage, pageSize: resultSize },
      paramsSerializer: (params) => {
        return queryString.stringify(params);
      },
    })
    .then((res) => res.data);
};

export type ExpenseServiceProviderProps = {
  children?: React.ReactNode;
  searchExpenses?: any;
  countExpenses?: any;
  getExpenseById?: any;
  updateExpense?: any;
  createExpense?: any;
  deleteExpense?: any;
  getSelectOptions?: any;
  getByParameters?: any;
};

export const ExpenseServiceProvider: React.FC<ExpenseServiceProviderProps> = (
  props
) => {
  const searchExpenses = (searchDto: ExpenseSearchDto) => {
    return axios.post("/expense/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countExpenses = (searchDto: ExpenseSearchDto) => {
    return axios.post("/expense/count", searchDto).then((res) => res.data);
  };

  const getSelectOptions = async (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => {
    return await axios
      .get(`/expense/select-options`, {
        params: {
          searchString: label,
          page: resultPage,
          pageSize: resultSize,
          ids: ids ?? [],
        },
      })
      .then((res) => res.data.data);
  };

  const getExpenseById = (expenseId: guid) => {
    return axios
      .get<ExpenseDetailsDto>("/expense/" + expenseId)
      .then(async (res) => {
        return res.data;
      });
  };

  const updateExpense = (id: guid, expense: ExpenseCreateUpdateDto) => {
    return axios.put("/expense/" + id, expense).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createExpense = (expense: ExpenseCreateUpdateDto) => {
    return axios.post("/expense/", expense).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteExpense = (expenseId: guid) => {
    return axios.delete("/expense/" + expenseId).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const value = {
    searchExpenses: props.searchExpenses || searchExpenses,
    countExpenses: props.countExpenses || countExpenses,
    getExpenseById: props.getExpenseById || getExpenseById,
    updateExpense: props.updateExpense || updateExpense,
    createExpense: props.createExpense || createExpense,
    deleteExpense: props.deleteExpense || deleteExpense,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
    getByParameters: props.getByParameters || getByParameters,
  };

  return (
    <ExpenseServiceContext.Provider value={value}>
      {props.children}
    </ExpenseServiceContext.Provider>
  );
};

export const useExpenseService = () => {
  return useContext(ExpenseServiceContext);
};

export { getByParameters };
