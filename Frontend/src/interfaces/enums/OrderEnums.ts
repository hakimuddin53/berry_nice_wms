export const OrderStatusEnum = {
  OPEN: "OPEN",
  INPROCESS: "INPROCESS",
  FINISHED: "FINISHED",
  LOCKED: "LOCKED",
  CANCELED: "CANCELED",
  INACTIVE: "INACTIVE",
} as const;

export const OrderTaskStatusEnum = {
  OPEN: "OPEN",
  INPROCESS: "INPROCESS",
  FINISHED: "FINISHED",
  LOCKED: "LOCKED",
  CANCELED: "CANCELED",
  INACTIVE: "INACTIVE",
  RESERVES_STOCK: "RESERVES_STOCK",
} as const;

export const OrderTaskDocumentTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  HU_DATA: "HU_DATA",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type OrderStatusEnum =
  typeof OrderStatusEnum[keyof typeof OrderStatusEnum];
export type OrderTaskStatusEnum =
  typeof OrderTaskStatusEnum[keyof typeof OrderTaskStatusEnum];
export type OrderTaskDocumentTypeEnum =
  typeof OrderTaskDocumentTypeEnum[keyof typeof OrderTaskDocumentTypeEnum];
/* eslint-enable */
