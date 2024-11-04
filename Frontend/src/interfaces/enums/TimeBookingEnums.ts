export const TimeBookingStatusEnum = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
  CANCELLED: "CANCELLED",
} as const;

export const TimeBookingPartnerRoleEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DRIVER: "DRIVER",
  SUPPLIER: "SUPPLIER",
} as const;

export const TimeBookingStatusCodeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  CUSTOMER_CONFIRMATION: "CUSTOMER_CONFIRMATION",
  CANCELED: "CANCELED",
  CHECKED_IN: "CHECKED_IN",
  IN_PROGRESS: "IN_PROGRESS",
  TEMPORARY_WHITELISTED: "TEMPORARY_WHITELISTED",
} as const;

export const TimeBookingStatusValueEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  TRUE: "TRUE",
  FALSE: "FALSE",
} as const;

export const TimeBookingReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  LAST_FREIGHT_MATERIAL_NAME: "LAST_FREIGHT_MATERIAL_NAME",
  LAST_FREIGHT_IDTF_NUMBER: "LAST_FREIGHT_IDTF_NUMBER",
  LAST_FREIGHT_CLEANING_TYPE: "LAST_FREIGHT_CLEANING_TYPE",
  SECOND_LAST_FREIGHT_MATERIAL_NAME: "SECOND_LAST_FREIGHT_MATERIAL_NAME",
  SECOND_LAST_FREIGHT_IDTF_NUMBER: "SECOND_LAST_FREIGHT_IDTF_NUMBER",
  SECOND_LAST_FREIGHT_CLEANING_TYPE: "SECOND_LAST_FREIGHT_CLEANING_TYPE",
  THIRD_LAST_FREIGHT_MATERIAL_NAME: "THIRD_LAST_FREIGHT_MATERIAL_NAME",
  THIRD_LAST_FREIGHT_IDTF_NUMBER: "THIRD_LAST_FREIGHT_IDTF_NUMBER",
  THIRD_LAST_FREIGHT_CLEANING_TYPE: "THIRD_LAST_FREIGHT_CLEANING_TYPE",
  SMS_CODE: "SMS_CODE",
  SMS_SENT: "SMS_SENT",
  PLANT: "PLANT",
  CLEANING_DOCUMENT_REQUIRED: "CLEANING_DOCUMENT_REQUIRED",
} as const;

export const TimeBookingDocumentTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  IMAGE: "IMAGE",
  DOCUMENT: "DOCUMENT",
} as const;

export const TimeBookingSlotTimeTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  START: "START",
  END: "END",
} as const;

export const TimeBookingSlotTimeCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  UNDEFINED: "UNDEFINED",
  PLANNED: "PLANNED",
  ACTUAL: "ACTUAL",
} as const;

export const TimeBookingSlotStatusCodeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  CANCELED: "CANCELED",
  LOAD_UNLOAD: "LOAD_UNLOAD",
} as const;

export const TimeBookingSlotStatusValueEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  NOT_RELEVANT: "NOT_RELEVANT",
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  PAUSED: "PAUSED",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
} as const;

export const LinkedEntityTypeEnum = {
  INBOUND_DELIVERY_ITEM: "INBOUND_DELIVERY_ITEM",
  OUTBOUND_DELIVERY_ITEM: "OUTBOUND_DELIVERY_ITEM",
} as const;

export const TimeBookingRelevancyEnum = {
  CONSIDER_FOR_TIME_BOOKINGS: "CONSIDER_FOR_TIME_BOOKINGS",
  DO_NOT_CONSIDER_FOR_TIME_BOOKINGS: "DO_NOT_CONSIDER_FOR_TIME_BOOKINGS",
} as const;

export const TimeBookingDeliveryTypeEnum = {
  INBOUND: "INBOUND",
  OUTBOUND: "OUTBOUND",
};

export const TimeBookingDeliveryStatusEnum = {
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  NOT_RELEVANT: "NOT_RELEVANT",
};

/* eslint-disable @typescript-eslint/no-redeclare */
export type TimeBookingStatusEnum =
  typeof TimeBookingStatusEnum[keyof typeof TimeBookingStatusEnum];
export type TimeBookingPartnerRoleEnum =
  typeof TimeBookingPartnerRoleEnum[keyof typeof TimeBookingPartnerRoleEnum];
export type TimeBookingStatusCodeEnum =
  typeof TimeBookingStatusCodeEnum[keyof typeof TimeBookingStatusCodeEnum];
export type TimeBookingStatusValueEnum =
  typeof TimeBookingStatusValueEnum[keyof typeof TimeBookingStatusValueEnum];
export type TimeBookingReferenceTypeEnum =
  typeof TimeBookingReferenceTypeEnum[keyof typeof TimeBookingReferenceTypeEnum];
export type TimeBookingDocumentTypeEnum =
  typeof TimeBookingDocumentTypeEnum[keyof typeof TimeBookingDocumentTypeEnum];
export type TimeBookingSlotTimeTypeEnum =
  typeof TimeBookingSlotTimeTypeEnum[keyof typeof TimeBookingSlotTimeTypeEnum];
export type TimeBookingSlotTimeCategoryEnum =
  typeof TimeBookingSlotTimeCategoryEnum[keyof typeof TimeBookingSlotTimeCategoryEnum];
export type TimeBookingSlotStatusCodeEnum =
  typeof TimeBookingSlotStatusCodeEnum[keyof typeof TimeBookingSlotStatusCodeEnum];
export type TimeBookingSlotStatusValueEnum =
  typeof TimeBookingSlotStatusValueEnum[keyof typeof TimeBookingSlotStatusValueEnum];
export type LinkedEntityTypeEnum =
  typeof LinkedEntityTypeEnum[keyof typeof LinkedEntityTypeEnum];
export type TimeBookingRelevancyEnum =
  typeof TimeBookingRelevancyEnum[keyof typeof TimeBookingRelevancyEnum];
export type TimeBookingDeliveryTypeEnum =
  typeof TimeBookingDeliveryTypeEnum[keyof typeof TimeBookingDeliveryTypeEnum];
export type TimeBookingDeliveryStatusEnum =
  typeof TimeBookingDeliveryStatusEnum[keyof typeof TimeBookingDeliveryStatusEnum];
/* eslint-enable */
