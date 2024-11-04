import { CompanyMenuDetailsV12Dto } from "interfaces/v12/companyMenus/menuTreesDetails/CompanyMenuDetailV12Dto";
import React from "react";
import { guid } from "types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface ICustomerMenuService {
  getCompanyMenusById: (
    companyMenuId: guid
  ) => Promise<CompanyMenuDetailsV12Dto>;
}

const CompanyMenuServiceContext = createContext({} as ICustomerMenuService);

export type CompanyMenuProviderProps = {
  children?: React.ReactNode;
  getCompanyMenusById?: any;
};
export const CompanyMenuProvider: React.FC<CompanyMenuProviderProps> = (
  props
) => {
  const getCompanyMenusById = (companyMenuId: string) => {
    return axios
      .get<CompanyMenuDetailsV12Dto>(`/v12/company-menus/${companyMenuId}`)
      .then(async (res) => {
        let companyMenu: CompanyMenuDetailsV12Dto;
        companyMenu = res.data;
        return companyMenu;
      });
  };

  const value = {
    getCompanyMenusById: props.getCompanyMenusById || getCompanyMenusById,
  };

  return (
    <CompanyMenuServiceContext.Provider value={value}>
      {props.children}
    </CompanyMenuServiceContext.Provider>
  );
};

export const useCompanyMenuService = () => {
  return useContext(CompanyMenuServiceContext);
};
