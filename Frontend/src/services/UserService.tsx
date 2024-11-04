import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import { UserDetailsV12Dto } from "interfaces/v12/user/userDetails/UserDetailsV12Dto";
import { UserUpdateLocaleV12Dto } from "interfaces/v12/user/userUpdateLocale/UserUpdateLocaleV12Dto";
import qs from "qs";
import React from "react";
import { guid } from "../types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IUserService {
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultSize: number
  ) => Promise<SelectAsyncOption[]>;
  getByParameters: (
    userIds: guid[],
    resultPage?: number,
    resultSize?: number
  ) => Promise<PagedListDto<UserDetailsV12Dto>>;
  getCurrentUserDetails: () => Promise<UserDetailsV12Dto>;
  updateUserLocale: (locale: UserUpdateLocaleV12Dto) => Promise<any>;
}

const UserServiceContext = createContext({} as IUserService);

const getByParameters = (
  userIds: guid[],
  resultPage?: number,
  resultSize?: number
) => {
  return axios
    .get("/v12/users", {
      params: { userIds, page: resultPage, pageSize: resultSize },
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    })
    .then((res) => res.data);
};

export type UserServiceProviderProps = {
  children?: React.ReactNode;
  getSelectOptions?: IUserService["getSelectOptions"];
  getByParameters?: IUserService["getByParameters"];
  getCurrentUserDetails?: IUserService["getCurrentUserDetails"];
  updateUserLocale?: IUserService["updateUserLocale"];
};

export const UserServiceProvider: React.FC<UserServiceProviderProps> = (
  props
) => {
  const getSelectOptions = (
    userName: string,
    resultPage: number,
    resultSize: number
  ) => {
    return axios
      .get("/v12/users/select-options", {
        params: {
          searchString: userName,
          page: resultPage,
          pageSize: resultSize,
        },
      })
      .then((res) => res.data.data);
  };

  const getCurrentUserDetails = async () => {
    const response = await axios.get<UserDetailsV12Dto>("/v12/users/current");
    let result = response.data as UserDetailsV12Dto;

    return result;
  };

  const updateUserLocale = (locale: UserUpdateLocaleV12Dto) => {
    return axios.put("v12/users/current/locale", locale);
  };

  const value = {
    getSelectOptions: props.getSelectOptions || getSelectOptions,
    getByParameters: props.getByParameters || getByParameters,
    getCurrentUserDetails: props.getCurrentUserDetails || getCurrentUserDetails,
    updateUserLocale: props.updateUserLocale || updateUserLocale,
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
