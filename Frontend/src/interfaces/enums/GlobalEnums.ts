export const ClientCodeEnum = {
  PETRONAS: "PETRONAS",
  PROTON: "PROTON",
  UTP: "UTP",
  MXD: "MXD",
};

export const ModuleEnum = {
  STOCKIN: "STOCKIN",
  STOCKOUT: "STOCKOUT",
  STOCKTRANSFER: "STOCKTRANSFER",
  STOCKRESERVATION: "STOCKRESERVATION",
  CATEGORY: "CATEGORY",
  COLOUR: "COLOUR",
  DESIGN: "DESIGN",
  LOCATION: "LOCATION",
  PRODUCT: "PRODUCT",
  INVENTORY: "INVENTORY",
  SIZE: "SIZE",
  STOCKGROUP: "STOCKGROUP",
  WAREHOUSE: "WAREHOUSE",
  USER: "USER",
  USERROLE: "USERROLE",
};

export const MonthEnum = {
  JANUARY: "JANUARY",
  FEBRUARY: "FEBRUARY",
  MARCH: "MARCH",
  APRIL: "APRIL",
  MAY: "MAY",
  JUNE: "JUNE",
  JULY: "JULY",
  AUGUST: "AUGUST",
  SEPTEMBER: "SEPTEMBER",
  OCTOBER: "OCTOBER",
  NOVEMBER: "NOVEMBER",
  DECEMBER: "DECEMBER",
} as const;

export const UploadActionEnum = {
  CREATED: "CREATED",
  UPDATED: "UPDATED",
};

export const MenuItemTypeEnum = {
  MVC: "MVC",
  REACT: "REACT",
  EXTERNAL_LINK: "EXTERNAL_LINK",
};

/* eslint-disable @typescript-eslint/no-redeclare */
export type ClientCodeEnum = typeof ClientCodeEnum[keyof typeof ClientCodeEnum];
export type ModuleEnum = typeof ModuleEnum[keyof typeof ModuleEnum];
export type MonthEnum = typeof MonthEnum[keyof typeof MonthEnum];
export type MenuItemTypeEnum =
  typeof MenuItemTypeEnum[keyof typeof MenuItemTypeEnum];
export type UploadActionEnum =
  typeof UploadActionEnum[keyof typeof UploadActionEnum];
/* eslint-enable */
