export const LocationTransferStatusEnum = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;

export const LocationTransferTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  LOCATION_TRANSFER: "LOCATION_TRANSFER",
  PURCHASING_TRANSFER: "PURCHASING_TRANSFER",
  LOCATION_TRANSFER_PICKUP: "LOCATION_TRANSFER_PICKUP",
  LOCATION_TRANSFER_REDISTRIBUTION: "LOCATION_TRANSFER_REDISTRIBUTION",
  MANUAL_ORDER: "MANUAL_ORDER",
  PROPOSAL: "PROPOSAL",
  MANUAL_RETURN: "MANUAL_RETURN",
} as const;

export const LocationTransferTimeTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  CONFIRMED_BY_SOURCE_LOCATION: "CONFIRMED_BY_SOURCE_LOCATION",
  CONFIRMED_BY_DESTINATION_LOCATION: "CONFIRMED_BY_DESTINATION_LOCATION",
  APPROVED: "APPROVED",
  WAITING_FOR_APPROVAL: "WAITING_FOR_APPROVAL",
  PARTIAL_DELIVERIES_CREATED: "PARTIAL_DELIVERIES_CREATED",
  COMPLETED: "COMPLETED",
  DELIVERY_DATE: "DELIVERY_DATE",
  CANCELLED: "CANCELLED",
  GOODS_ISSUE: "GOODS_ISSUE",
  DELIVERIES_CREATED: "DELIVERIES_CREATED",
} as const;

export const LocationTransferTimeCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  UNDEFINED: "UNDEFINED",
  PLANNED: "PLANNED",
  ACTUAL: "ACTUAL",
  REQUESTED: "REQUESTED",
  CALCULATED: "CALCULATED",
  LATEST: "LATEST",
} as const;

export const LocationTransferItemClassificationEnum = {
  MATERIAL: "MATERIAL",
  HU: "HU",
  CONTAINER: "CONTAINER",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type LocationTransferStatusEnum =
  typeof LocationTransferStatusEnum[keyof typeof LocationTransferStatusEnum];
export type LocationTransferTypeEnum =
  typeof LocationTransferTypeEnum[keyof typeof LocationTransferTypeEnum];
export type LocationTransferTimeCategoryEnum =
  typeof LocationTransferTimeCategoryEnum[keyof typeof LocationTransferTimeCategoryEnum];
export type LocationTransferTimeTypeEnum =
  typeof LocationTransferTimeTypeEnum[keyof typeof LocationTransferTimeTypeEnum];
export type LocationTransferItemClassificationEnum =
  typeof LocationTransferItemClassificationEnum[keyof typeof LocationTransferItemClassificationEnum];
/* eslint-enable */
