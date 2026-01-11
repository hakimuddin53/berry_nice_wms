import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import {
  UserDetailsV12Dto,
  UserSearchDto,
} from "interfaces/v12/user/userDetails/UserDetailsV12Dto";
import { UserUpdateLocaleV12Dto } from "interfaces/v12/user/userUpdateLocale/UserUpdateLocaleV12Dto";
import queryString from "query-string";
import React from "react";
import { guid } from "../types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IUserService {
  searchUsers: (searchDto: any) => Promise<UserDetailsV12Dto[]>;
  countUsers: (searchDto: any) => Promise<number>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
  getByParameters: (
    userIds: guid[],
    resultPage?: number,
    resultSize?: number
  ) => Promise<PagedListDto<UserDetailsV12Dto>>;
  getCurrentUserDetails: () => Promise<UserDetailsV12Dto>;
  updateUserLocale: (locale: UserUpdateLocaleV12Dto) => Promise<any>;
  getUserById: (id: guid) => Promise<UserDetailsV12Dto>;
  createUser: (user: any) => Promise<any>;
  updateUser: (id: guid, user: any) => Promise<any>;
  deleteUser(id: guid): Promise<void>;
}

const UserServiceContext = createContext({} as IUserService);

export type UserServiceProviderProps = {
  children?: React.ReactNode;
  getSelectOptions?: IUserService["getSelectOptions"];
  getByParameters?: IUserService["getByParameters"];
  getCurrentUserDetails?: IUserService["getCurrentUserDetails"];
  updateUserLocale?: IUserService["updateUserLocale"];
  getUserById?: IUserService["getUserById"];
  createUser?: IUserService["createUser"];
  updateUser?: IUserService["updateUser"];
  deleteUser?: IUserService["deleteUser"];
  searchUsers?: IUserService["searchUsers"];
  countUsers?: IUserService["countUsers"];
};

const getByParameters = (
  userIds: guid[],
  resultPage?: number,
  resultSize?: number
) => {
  return axios
    .get("/user", {
      params: { userIds, page: resultPage, pageSize: resultSize },
      paramsSerializer: (params) => {
        return queryString.stringify(params);
      },
    })
    .then((res) => res.data);
};

const getUserById = async (id: guid) => {
  const response = await axios.get(`/user/${id}`);
  return response.data;
};

const createUser = async (user: any) => {
  const response = await axios.post("/user", user);
  return response.data;
};

const updateUser = async (id: guid, user: any) => {
  const response = await axios.put(`/user/${id}`, user);
  return response.data;
};

const deleteUser = async (id: guid) => {
  const response = await axios.delete(`/user/${id}`);
  return response.data;
};

const searchUsers = (searchDto: UserSearchDto) => {
  return axios.post("/user/search", searchDto).then((res) => {
    return res.data.data;
  });
};

const countUsers = (searchDto: any) => {
  return axios.post("/user/count", searchDto).then((res) => res.data);
};

export const UserServiceProvider: React.FC<UserServiceProviderProps> = (
  props
) => {
  const getSelectOptions = (
    userName: string,
    resultPage: number,
    resultSize: number,
    ids?: string[]
  ) => {
    return axios
      .get("/v12/user/select-options", {
        params: {
          searchString: userName,
          page: resultPage,
          pageSize: resultSize,
          ids: ids ?? [],
        },
      })
      .then((res) => res.data.data);
  };

  const getCurrentUserDetails = async () => {
    const response = await axios.get<UserDetailsV12Dto>("/v12/user/current");
    let result = response.data as UserDetailsV12Dto;

    return result;
  };

  const updateUserLocale = (locale: UserUpdateLocaleV12Dto) => {
    return axios.put("v12/user/current/locale", locale);
  };

  const value = {
    getSelectOptions: props.getSelectOptions || getSelectOptions,
    getByParameters: props.getByParameters || getByParameters,
    getCurrentUserDetails: props.getCurrentUserDetails || getCurrentUserDetails,
    updateUserLocale: props.updateUserLocale || updateUserLocale,
    getUserById: props.getUserById || getUserById,
    createUser: props.createUser || createUser,
    updateUser: props.updateUser || updateUser,
    deleteUser: props.deleteUser || deleteUser,
    searchUsers: props.searchUsers || searchUsers,
    countUsers: props.countUsers || countUsers,
  };

  return (
    <UserServiceContext.Provider value={value}>
      {props.children}
    </UserServiceContext.Provider>
  );
};

export const useUserService = () => {
  return useContext(UserServiceContext);
};

export { getByParameters };
