import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import {
  UserRoleDetailsDto,
  UserRoleSearchDto,
} from "interfaces/v12/userRole/userRole";
import qs from "qs";
import React from "react";
import { guid } from "../types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IUserRoleService {
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
  getByParameters: (
    roleIds: guid[],
    resultPage?: number,
    resultSize?: number
  ) => Promise<PagedListDto<UserRoleDetailsDto>>;
  getUserRoleById: (id: guid) => Promise<UserRoleDetailsDto>;
  createUserRole: (role: any) => Promise<any>;
  updateUserRole: (id: guid, role: any) => Promise<any>;
  searchUserRoles: (searchDto: any) => Promise<SelectAsyncOption[]>;
}

const UserRoleServiceContext = createContext({} as IUserRoleService);

const getByParameters = (
  roleIds: guid[],
  resultPage?: number,
  resultSize?: number
) => {
  return axios
    .get("/user-role", {
      params: { roleIds, page: resultPage, pageSize: resultSize },
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    })
    .then((res) => res.data);
};

const getSelectOptions = (
  roleName: string,
  resultPage: number,
  resultSize: number,
  ids?: string[]
) => {
  return axios
    .get("/user-role/select-options", {
      params: {
        searchString: roleName,
        page: resultPage,
        pageSize: resultSize,
        ids: ids,
      },
    })
    .then((res) => res.data.data);
};

const getUserRoleById = async (id: guid) => {
  const response = await axios.get(`/user-role/${id}`);
  return response.data;
};

const createUserRole = async (role: any) => {
  const response = await axios.post("/user-role", role);
  return response.data;
};

const updateUserRole = async (id: guid, role: any) => {
  const response = await axios.put(`/user-role/${id}`, role);
  return response.data;
};

const searchUserRoles = (searchDto: UserRoleSearchDto) => {
  return axios.post("/user-role/search", searchDto).then((res) => {
    return res.data.data;
  });
};

export type UserRoleServiceProviderProps = {
  children?: React.ReactNode;
  getSelectOptions?: IUserRoleService["getSelectOptions"];
  getByParameters?: IUserRoleService["getByParameters"];
  getUserRoleById?: IUserRoleService["getUserRoleById"];
  createUserRole?: IUserRoleService["createUserRole"];
  updateUserRole?: IUserRoleService["updateUserRole"];
  searchUserRoles?: IUserRoleService["searchUserRoles"];
};

export const UserRoleServiceProvider: React.FC<UserRoleServiceProviderProps> = (
  props
) => {
  const value = {
    getSelectOptions: props.getSelectOptions || getSelectOptions,
    getByParameters: props.getByParameters || getByParameters,
    getUserRoleById: props.getUserRoleById || getUserRoleById,
    createUserRole: props.createUserRole || createUserRole,
    updateUserRole: props.updateUserRole || updateUserRole,
    searchUserRoles: props.searchUserRoles || searchUserRoles,
  };

  return (
    <UserRoleServiceContext.Provider value={value}>
      {props.children}
    </UserRoleServiceContext.Provider>
  );
};

export const useUserRoleService = () => {
  return useContext(UserRoleServiceContext);
};

export { getByParameters };
