import { SortableDataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import {
  ModuleEnum,
  ReservationStatusEnum,
} from "interfaces/enums/GlobalEnums";
import parsePhoneNumberFromString from "libphonenumber-js";
import { baseURL } from "./axios";

export const isJsonString = (value: string) => {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
};

export const DataUriToBlob = (dataURI: string) => {
  const splitDataURI = dataURI.split(",");
  const byteString =
    splitDataURI[0].indexOf("base64") >= 0
      ? window.atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
};

export const GetBackendUrl = (to: string) => {
  const cleanedBaseUrl = baseURL?.endsWith("/")
    ? baseURL.slice(0, -1)
    : baseURL;
  const cleanedTo = to.startsWith("/") ? to : "/" + to;

  return `${cleanedBaseUrl}${cleanedTo}`;
};

export const RemoveExistingCreatedChanged = (
  id: string,
  columns: SortableDataTableHeaderCell<any, any>[]
) => {
  const index = columns.findIndex((i) => i.id === id);
  if (index >= 0) {
    columns.splice(index, 1);
  }
};

export const stringToDateTime = (
  dateTimeStr: string | null | undefined
): Date | null => {
  if (!dateTimeStr) {
    return null; // Return null if input is null, undefined, or empty
  }

  const date = new Date(dateTimeStr);
  return isNaN(date.getTime()) ? null : date; // Check if the date or time is valid
};

export const removeLeadingZeros = (inputString: string): string => {
  return inputString.replace(/^0+/, "");
};

export const generateGUID = (): string => {
  const pattern = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  return pattern.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const hasCountryCode = (phoneNumber?: string | null): boolean => {
  try {
    const parsedNumber = parsePhoneNumberFromString(phoneNumber ?? "");

    if (parsedNumber && parsedNumber.country) {
      // The 'country' property holds the ISO 3166-1 alpha-2 country code if parsing was successful
      return true;
    }
  } catch (error) {
    console.error("Error parsing phone number:", error);
  }
  return false;
};

export const validateParseAndExtractCountryCallingCode = (
  phoneNumber: string
) => {
  try {
    const parsedNumber = parsePhoneNumberFromString(phoneNumber);
    if (parsedNumber?.isValid()) {
      return {
        valid: true,
        countryCallingCode: parsedNumber.countryCallingCode, // Extract the country calling code
      };
    } else {
      return {
        valid: false,
        countryCallingCode: null,
      };
    }
  } catch (error) {
    return {
      valid: false,
      countryCallingCode: null,
    };
  }
};

export const timeStringToNumber = (time: string) => {
  if (time) {
    let minutes = parseInt(time.split(":")[1]);
    let hours = parseInt(time.split(":")[0]);
    return hours * 60 + minutes * 1;
  } else {
    return 0;
  }
};

export const numberToTime = (number: number): string => {
  let minutes: number = number % 60;
  let hours: number = (number - minutes) / 60;
  return hours + ":" + (minutes < 10 ? "0" + minutes : minutes);
};

export const timeFormat: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export const getCurrentDate = () => {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    0,
    0,
    0,
    0
  );
};

export const getNotMatchArrayData = (valueA: string[], valueB: string[]) => {
  let result = valueA.filter(function (id) {
    return !valueB.includes(id);
  });
  return result;
};

export const getBatches = <T>(array: T[], batchSize: number): T[][] => {
  if (batchSize <= 0) {
    throw new Error("Batch size must be greater than zero.");
  }
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    batches.push(batch);
  }
  return batches;
};

export const getModuleName = (moduleNumber: any) => {
  // Find the key in ModuleEnum whose value matches the moduleNumber (index + 1)
  const moduleKey = Object.keys(ModuleEnum).find((key) => {
    // Assuming the enum values are assigned sequentially starting from 1
    return Object.keys(ModuleEnum).indexOf(key) === moduleNumber;
  });
  return moduleKey || moduleNumber;
};

export const getReservationStatusName = (reservationStatus: any) => {
  // Find the key in ReservationStatusEnum whose value matches the reservationStatus (index + 1)
  const moduleKey = Object.keys(ReservationStatusEnum).find((key) => {
    // Assuming the enum values are assigned sequentially starting from 1

    return (
      Object.keys(ReservationStatusEnum).indexOf(key) === reservationStatus
    );
  });
  return moduleKey || reservationStatus;
};
