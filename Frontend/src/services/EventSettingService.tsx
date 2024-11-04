import { EventSettingCreateV12Dto } from "interfaces/v12/eventSetting/eventSettingCreate/eventSettingCreateV12Dto";
import { EventSettingDetailsV12Dto } from "interfaces/v12/eventSetting/eventSettingDetails/eventSettingDetailsV12Dto";
import { EventSettingSearchV12Dto } from "interfaces/v12/eventSetting/eventSettingSearch/eventSettingSearchV12Dto";
import React from "react";
import { guid } from "../types/guid";
import axios from "../utils/axios";

const { createContext, useContext } = React;

interface IEventSettingService {
  searchEventSettings: (
    searchDto: EventSettingSearchV12Dto
  ) => Promise<EventSettingDetailsV12Dto[]>;
  countEventSettings: (searchDto: any) => Promise<number>;
  getEventSettingById: (
    eventSettingId: guid
  ) => Promise<EventSettingDetailsV12Dto>;
  updateEventSetting: (
    id: guid,
    eventSetting: EventSettingCreateV12Dto
  ) => Promise<any>;
  createEventSetting: (
    eventSetting: EventSettingCreateV12Dto
  ) => Promise<string>;
  deleteEventSetting: (eventSettingId: guid) => Promise<any>;
}

const EventSettingServiceContext = createContext({} as IEventSettingService);

export type EventSettingServiceProviderProps = {
  children?: React.ReactNode;
  searchEventSettings?: any;
  countEventSettings?: any;
  getEventSettingById?: any;
  updateEventSetting?: any;
  createEventSetting?: any;
  deleteEventSetting?: any;
};
export const EventSettingServiceProvider: React.FC<
  EventSettingServiceProviderProps
> = (props) => {
  const searchEventSettings = (searchDto: EventSettingSearchV12Dto) => {
    return axios.post("/v12/event-settings/search", searchDto).then((res) => {
      return res.data.data;
    });
  };

  const countEventSettings = (searchDto: any) => {
    return axios
      .post("/v12/event-settings/count", searchDto)
      .then((res) => res.data);
  };

  const getEventSettingById = (eventSettingId: guid) => {
    return axios
      .get<EventSettingDetailsV12Dto>("/v12/event-settings/" + eventSettingId)
      .then(async (res) => {
        return res.data;
      });
  };

  const updateEventSetting = (
    id: guid,
    eventSetting: EventSettingCreateV12Dto
  ) => {
    return axios
      .put("/v12/event-settings/" + id, eventSetting)
      .then(async (res) => {
        let result = res.data;
        return result;
      });
  };

  const createEventSetting = (eventSetting: EventSettingCreateV12Dto) => {
    return axios
      .post("/v12/event-settings/", eventSetting)
      .then(async (res) => {
        let result = res.data;
        return result.id;
      });
  };

  const deleteEventSetting = (eventSettingId: guid) => {
    return axios
      .delete("/v12/event-settings/" + eventSettingId)
      .then(async (res) => {
        let result = res.data;
        return result.id;
      });
  };

  const value = {
    searchEventSettings: props.searchEventSettings || searchEventSettings,
    countEventSettings: props.countEventSettings || countEventSettings,
    getEventSettingById: props.getEventSettingById || getEventSettingById,
    updateEventSetting: props.updateEventSetting || updateEventSetting,
    createEventSetting: props.createEventSetting || createEventSetting,
    deleteEventSetting: props.deleteEventSetting || deleteEventSetting,
  };

  return (
    <EventSettingServiceContext.Provider value={value}>
      {props.children}
    </EventSettingServiceContext.Provider>
  );
};

export const useEventSettingService = () => {
  return useContext(EventSettingServiceContext);
};
