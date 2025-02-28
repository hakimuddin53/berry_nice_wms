import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import {
  DesignCreateUpdateDto,
  DesignDetailsDto,
  DesignSearchDto,
} from "interfaces/v12/design/design";
import React from "react";
import { guid } from "types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IDesignService {
  getDesignById: (designId: string) => Promise<DesignDetailsDto>;
  searchDesigns: (searchDto: any) => Promise<DesignDetailsDto[]>;
  countDesigns: (searchDto: any) => Promise<number>;
  updateDesign: (id: guid, design: DesignCreateUpdateDto) => Promise<any>;
  createDesign: (design: DesignCreateUpdateDto) => Promise<string>;
  deleteDesign: (designId: guid) => Promise<any>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultDesign: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
}

const DesignServiceContext = createContext({} as IDesignService);

export const DesignServiceProvider: React.FC<{
  children?: React.ReactNode;
  searchDesigns?: any;
  countDesigns?: any;
  updateDesign?: any;
  createDesign?: any;
  deleteDesign?: any;
  getDesignById?: any;
  getSelectOptions?: any;
}> = (props) => {
  const getDesignById = async (designId: string) => {
    return await axios.get(`/design/${designId}`).then((res) => res.data);
  };

  const searchDesigns = (searchDto: DesignSearchDto) => {
    return axios.post("/design/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countDesigns = (searchDto: any) => {
    return axios.post("/design/count", searchDto).then((res) => res.data);
  };

  const updateDesign = (id: guid, design: DesignCreateUpdateDto) => {
    return axios.put("/design/" + id, design).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createDesign = (design: DesignCreateUpdateDto) => {
    return axios.post("/design/", design).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteDesign = (designId: guid) => {
    return axios.delete("/design/" + designId).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const getSelectOptions = async (
    label: string,
    resultPage: number,
    resultDesign: number,
    ids?: string[]
  ) => {
    return await axios
      .get(`/design/select-options`, {
        params: {
          searchString: label,
          page: resultPage,
          pageDesign: resultDesign,
          ids: ids ?? [],
        },
      })
      .then((res) => res.data.data);
  };

  const value = {
    searchDesigns: props.searchDesigns || searchDesigns,
    countDesigns: props.countDesigns || countDesigns,
    updateDesign: props.updateDesign || updateDesign,
    createDesign: props.createDesign || createDesign,
    deleteDesign: props.deleteDesign || deleteDesign,
    getDesignById: props.getDesignById || getDesignById,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
  };

  return (
    <DesignServiceContext.Provider value={value}>
      {props.children}
    </DesignServiceContext.Provider>
  );
};

export const useDesignService = () => {
  return useContext(DesignServiceContext);
};
