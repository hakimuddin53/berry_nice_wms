import React from "react";
import { guid } from "types/guid";
import axios from "../utils/axios";
import { CatalogMenuItemDetailsV12Dto } from "interfaces/v12/catalogMenuItem/catalogMenuItemDetails/catalogMenuItemDetails";

const { createContext, useContext } = React;

interface ICustomerMenuService {
  getCatalogMenuItemById: (
    catalogMenuItemId: guid
  ) => Promise<CatalogMenuItemDetailsV12Dto>;
}

const CatalogMenuItemServiceContext = createContext({} as ICustomerMenuService);

export type CatalogMenuItemProviderProps = {
  children?: React.ReactNode;
  getCatalogMenuItemById?: any;
};
export const CatalogMenuItemProvider: React.FC<CatalogMenuItemProviderProps> = (
  props
) => {
  const getCatalogMenuItemById = async (catalogMenuItemId: guid) => {
    const res = await axios({
      method: "get",
      url: `/v12/catalog-menu-items/${catalogMenuItemId}`,
    });

    if (res.statusText === "OK") {
      let catalogMenuItem: CatalogMenuItemDetailsV12Dto;
      catalogMenuItem = res.data;
      return catalogMenuItem;
    }
  };

  const value = {
    getCatalogMenuItemById:
      props.getCatalogMenuItemById || getCatalogMenuItemById,
  };

  return (
    <CatalogMenuItemServiceContext.Provider value={value}>
      {props.children}
    </CatalogMenuItemServiceContext.Provider>
  );
};

export const useCatalogMenuItemService = () => {
  return useContext(CatalogMenuItemServiceContext);
};
