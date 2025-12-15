// services/LookupServiceProvider.tsx
import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import {
  LookupCreateUpdateDto,
  LookupDetailsDto,
  LookupGroupKey,
  LookupSearchDto,
} from "interfaces/v12/lookup/lookup";
import React from "react";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface ILookupService {
  getById: (id: string) => Promise<LookupDetailsDto>;
  search: (args: {
    groupKey: LookupGroupKey;
    search?: string;
    page: number;
    pageSize: number;
    activeOnly?: boolean;
  }) => Promise<LookupDetailsDto[]>;
  count: (args: {
    groupKey: LookupGroupKey;
    search?: string;
    activeOnly?: boolean;
    page?: number;
    pageSize?: number;
  }) => Promise<number>;
  create: (dto: LookupCreateUpdateDto) => Promise<string>;
  update: (id: string, dto: LookupCreateUpdateDto) => Promise<any>;
  delete: (id: string) => Promise<any>;
  getSelectOptions: (
    groupKey: LookupGroupKey,
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
  getGroups: () => Promise<{ groupKey: LookupGroupKey; count: number }[]>;
}

const LookupServiceContext = createContext({} as ILookupService);

export const LookupServiceProvider: React.FC<{
  children?: React.ReactNode;
  search?: ILookupService["search"];
  count?: ILookupService["count"];
  update?: ILookupService["update"];
  create?: ILookupService["create"];
  delete?: ILookupService["delete"];
  getById?: ILookupService["getById"];
  getSelectOptions?: ILookupService["getSelectOptions"];
  getGroups?: ILookupService["getGroups"];
}> = (props) => {
  const getById: ILookupService["getById"] = async (id) =>
    axios.get(`/lookup/${id}`).then((r) => r.data as LookupDetailsDto);

  const search: ILookupService["search"] = async ({
    groupKey,
    search,
    page,
    pageSize,
    activeOnly = true,
  }) => {
    console.log(groupKey, search, page, pageSize, activeOnly);
    const body: LookupSearchDto = {
      groupKey,
      search,
      activeOnly,
      page: page + 1, // server is 1-based
      pageSize, // バ. PageSize
    };
    return axios
      .post(`/lookup/search`, body)
      .then((r) => r.data.data as LookupDetailsDto[]);
  };

  const count: ILookupService["count"] = async ({
    groupKey,
    search,
    activeOnly = true,
    page = 1,
    pageSize = 10,
  }) => {
    const body: LookupSearchDto = {
      groupKey,
      search,
      activeOnly,
      page,
      pageSize, // バ. PageSize
    };
    return axios.post(`/lookup/count`, body).then((r) => r.data as number);
  };

  const update: ILookupService["update"] = async (id, dto) =>
    axios.put(`/lookup/${id}`, dto).then((r) => r.data);

  const create: ILookupService["create"] = async (dto) =>
    axios.post(`/lookup`, dto).then((r) => (r.data?.id as string) ?? "");

  const _delete: ILookupService["delete"] = async (id) =>
    axios.delete(`/lookup/${id}`).then(() => id);

  const getSelectOptions: ILookupService["getSelectOptions"] = async (
    groupKey,
    label,
    resultPage,
    resultSize,
    ids
  ) => {
    const fallbackGradeOptions: SelectAsyncOption[] = [
      "AA",
      "AB",
      "AC",
      "AD",
      "AE",
      "AG",
    ].map((value) => ({ label: value, value }));

    const dedupeOptions = (options: SelectAsyncOption[]) => {
      const seen = new Set<string>();
      return options.filter((option) => {
        if (seen.has(option.value)) return false;
        seen.add(option.value);
        return true;
      });
    };

    return axios
      .get(`/lookup/select-options/${groupKey}`, {
        params: {
          searchString: label,
          page: resultPage, // バ. page
          pageSize: resultSize, // バ. pageSize
          ids: ids ?? [],
        },
      })
      .then((r) => r.data.data as { value: string; label: string }[])
      .then((rows) => rows.map((x) => ({ value: x.value, label: x.label })))
      .then((options) => {
        if (groupKey === LookupGroupKey.Grade) {
          return dedupeOptions([...(options ?? []), ...fallbackGradeOptions]);
        }
        return options;
      })
      .catch((err) => {
        if (groupKey === LookupGroupKey.Grade) {
          return fallbackGradeOptions;
        }
        throw err;
      });
  };

  const getGroups: ILookupService["getGroups"] = async () =>
    axios.get(`/lookup/groups`).then((r) => r.data);

  const value: ILookupService = {
    search: props.search || search,
    count: props.count || count,
    update: props.update || update,
    create: props.create || create,
    delete: props.delete || _delete,
    getById: props.getById || getById,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
    getGroups: props.getGroups || getGroups,
  };

  return (
    <LookupServiceContext.Provider value={value}>
      {props.children}
    </LookupServiceContext.Provider>
  );
};

export const useLookupService = () => useContext(LookupServiceContext);
