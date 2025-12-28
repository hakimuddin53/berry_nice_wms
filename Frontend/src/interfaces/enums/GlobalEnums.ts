export const ModuleEnum = {
  STOCKRECEIVE: "STOCKRECEIVE",
  STOCKTRANSFER: "STOCKTRANSFER",
  STOCKTAKE: "STOCKTAKE",
  INVENTORY: "INVENTORY",
  STOCKGROUP: "STOCKGROUP",
  USER: "USER",
  USERROLE: "USERROLE",
  CLIENTCODE: "CLIENTCODE",
  INVOICE: "INVOICE",
  LOOKUP: "LOOKUP",
  CUSTOMER: "CUSTOMER",
  SUPPLIER: "SUPPLIER",
  EXPENSE: "EXPENSE",
};

export const ReservationStatusEnum = {
  ACTIVE: "ACTIVE",
  FULFILLED: "FULFILLED",
  CANCELREQUESTED: "CANCELREQUESTED",
  CANCELLED: "CANCELLED",
  RELEASED: "RELEASED",
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
export type ModuleEnum = typeof ModuleEnum[keyof typeof ModuleEnum];
export type MonthEnum = typeof MonthEnum[keyof typeof MonthEnum];
export type MenuItemTypeEnum =
  typeof MenuItemTypeEnum[keyof typeof MenuItemTypeEnum];
export type UploadActionEnum =
  typeof UploadActionEnum[keyof typeof UploadActionEnum];
export type ReservationStatusEnum =
  typeof ReservationStatusEnum[keyof typeof ReservationStatusEnum];
/* eslint-enable */
