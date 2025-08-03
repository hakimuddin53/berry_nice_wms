import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import {
  ActiveLocationDto,
  LocationCreateUpdateDto,
  LocationDetailsDto,
  LocationSearchDto,
} from "interfaces/v12/location/location";
import queryString from "query-string";
import React from "react";
import { guid } from "types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface ILocationService {
  getLocationById: (locationId: string) => Promise<LocationDetailsDto>;
  searchLocations: (searchDto: any) => Promise<LocationDetailsDto[]>;
  countLocations: (searchDto: any) => Promise<number>;
  updateLocation: (id: guid, location: LocationCreateUpdateDto) => Promise<any>;
  createLocation: (location: LocationCreateUpdateDto) => Promise<string>;
  deleteLocation: (locationId: guid) => Promise<any>;
  getActiveLocations: (productId: guid, warehouseId: guid) => Promise<any>;
  getSelectOptions: (
    label: string,
    resultPage: number,
    resultLocation: number,
    ids?: string[]
  ) => Promise<SelectAsyncOption[]>;
  getByParameters: (
    userIds: guid[],
    resultPage?: number,
    resultSize?: number
  ) => Promise<PagedListDto<LocationDetailsDto>>;
}

const LocationServiceContext = createContext({} as ILocationService);

const getByParameters = (
  locationIds: guid[],
  resultPage?: number,
  resultSize?: number
) => {
  return axios
    .get("/location", {
      params: { locationIds, page: resultPage, pageSize: resultSize },
      paramsSerializer: (params) => {
        return queryString.stringify(params);
      },
    })
    .then((res) => res.data);
};

export const LocationServiceProvider: React.FC<{
  children?: React.ReactNode;
  searchLocations?: any;
  countLocations?: any;
  updateLocation?: any;
  createLocation?: any;
  deleteLocation?: any;
  getLocationById?: any;
  getSelectOptions?: any;
  getByParameters?: any;
  getActiveLocations?: any;
}> = (props) => {
  const getActiveLocations = (productId: guid, warehouseId: guid) => {
    return axios
      .get<ActiveLocationDto[]>("/location/active", {
        params: { productId, warehouseId },
      })
      .then((res) => res.data);
  };

  const getLocationById = async (locationId: string) => {
    return await axios.get(`/location/${locationId}`).then((res) => res.data);
  };

  const searchLocations = (searchDto: LocationSearchDto) => {
    return axios.post("/location/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countLocations = (searchDto: any) => {
    return axios.post("/location/count", searchDto).then((res) => res.data);
  };

  const updateLocation = (id: guid, location: LocationCreateUpdateDto) => {
    return axios.put("/location/" + id, location).then(async (res) => {
      let result = res.data;
      return result;
    });
  };

  const createLocation = (location: LocationCreateUpdateDto) => {
    return axios.post("/location/", location).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const deleteLocation = (locationId: guid) => {
    return axios.delete("/location/" + locationId).then(async (res) => {
      let result = res.data;
      return result.id;
    });
  };

  const getSelectOptions = async (
    label: string,
    resultPage: number,
    resultLocation: number,
    ids?: string[]
  ) => {
    return await axios
      .get(`/location/select-options`, {
        params: {
          searchString: label,
          page: resultPage,
          pageLocation: resultLocation,
          ids: ids ?? [],
        },
      })
      .then((res) => res.data.data);
  };

  const value = {
    searchLocations: props.searchLocations || searchLocations,
    countLocations: props.countLocations || countLocations,
    updateLocation: props.updateLocation || updateLocation,
    createLocation: props.createLocation || createLocation,
    deleteLocation: props.deleteLocation || deleteLocation,
    getLocationById: props.getLocationById || getLocationById,
    getSelectOptions: props.getSelectOptions || getSelectOptions,
    getByParameters: props.getByParameters || getByParameters,
    getActiveLocations: props.getActiveLocations || getActiveLocations,
  };

  return (
    <LocationServiceContext.Provider value={value}>
      {props.children}
    </LocationServiceContext.Provider>
  );
};

export const useLocationService = () => {
  return useContext(LocationServiceContext);
};

export { getByParameters };
