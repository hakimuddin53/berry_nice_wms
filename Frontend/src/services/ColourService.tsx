import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import {
  ColourCreateUpdateDto,
  ColourDetailsDto,
  ColourSearchDto,
} from "interfaces/v12/colour/colour";
import React from "react";
import { guid } from "types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IColourService {
  getColourById: (colourId: string) => Promise<ColourDetailsDto>;
  searchColours: (searchDto: any) => Promise<ColourDetailsDto[]>;
  countColours: (searchDto: any) => Promise<number>;
  updateColour: (id: guid, colour: ColourCreateUpdateDto) => Promise<any>;
  createColour: (colour: ColourCreateUpdateDto) => Promise<string>;
  deleteColour: (colourId: guid) => Promise<any>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultColour: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
}

const ColourServiceContext = createContext({} as IColourService);

export const ColourServiceProvider: React.FC<{
  children?: React.ReactNode;
  searchColours?: any;
  countColours?: any;
  updateColour?: any;
  createColour?: any;
  deleteColour?: any;
  getColourById?: any;
  getSelectOptions?: any;
}> = (props) => {
  const getColourById = async (colourId: string) => {
    return await axios.get(`/colour/${colourId}`).then((res) => res.data);
  };

  const searchColours = (searchDto: ColourSearchDto) => {
    return axios.post("/colour/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countColours = (searchDto: any) => {
    return axios.post("/colour/count", searchDto).then((res) => res.data);
  };

  const updateColour = (id: guid, colour: ColourCreateUpdateDto) => {
    return axios.put("/colour/" + id, colour).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createColour = (colour: ColourCreateUpdateDto) => {
    return axios.post("/colour/", colour).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteColour = (colourId: guid) => {
    return axios.delete("/colour/" + colourId).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const getSelectOptions = async (
    label: string,
    resultPage: number,
    resultColour: number,
    ids?: string[]
  ) => {
    return await axios
      .get(`/colour/select-options`, {
        params: {
          searchString: label,
          page: resultPage,
          pageColour: resultColour,
          ids: ids ?? [],
        },
      })
      .then((res) => res.data.data);
  };

  const value = {
    searchColours: props.searchColours || searchColours,
    countColours: props.countColours || countColours,
    updateColour: props.updateColour || updateColour,
    createColour: props.createColour || createColour,
    deleteColour: props.deleteColour || deleteColour,
    getColourById: props.getColourById || getColourById,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
  };

  return (
    <ColourServiceContext.Provider value={value}>
      {props.children}
    </ColourServiceContext.Provider>
  );
};

export const useColourService = () => {
  return useContext(ColourServiceContext);
};
