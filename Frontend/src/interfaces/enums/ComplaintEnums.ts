export const ComplaintTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  GR_COMPLAINT: "GR_COMPLAINT",
  INVENTORY_COMPLAINT: "INVENTORY_COMPLAINT",
  AUTOMATIC_COMPLAINT: "AUTOMATIC_COMPLAINT",
};

export const ComplaintStatusEnum = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
};

export const ComplaintItemTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
};

export const ComplaintItemQuantityRoleCategoryEnum = {
  REQUESTED: "REQUESTED",
  EXECUTED: "EXECUTED",
  OPEN: "OPEN",
};

export const ComplaintItemQuantityRoleEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEVIATION: "DEVIATION",
};

export const ComplaintReferenceReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
};

export const ComplaintItemReferenceReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
};

export const ComplaintItemClassificationEnum = {
  MATERIAL: "MATERIAL",
  HU: "HU",
  CONTAINER: "CONTAINER",
};

export const ComplaintItemDocumentTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  IMAGE: "IMAGE",
  DOCUMENT: "DOCUMENT",
};

export const ComplaintItemTimeTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  RESOLVED: "RESOLVED",
};

export const ComplaintItemTimeCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  PLANNED: "PLANNED",
  ACTUAL: "ACTUAL",
};

export const ComplaintItemStatusCodeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
};

export const ComplaintItemStatusValueEnum = {
  UNSPECIFIED: "UNSPECIFIED",
};

export const ComplaintStatusCodeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  PROCESS: "PROCESS",
};

export const ComplaintStatusValueEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
};

export const ComplaintTimeTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
};

export const ComplaintTimeCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  PLANNED: "PLANNED",
  ACTUAL: "ACTUAL",
};

export const ComplaintDocumentTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  IMAGE: "IMAGE",
  DOCUMENT: "DOCUMENT",
};

export const ComplaintPartnerRoleEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  TEST: "TEST",
  LF: "LF",
  VENDOR: "VENDOR",
  SP: "SP",
  SHIP_FROM_PARTY: "SHIP_FROM_PARTY",
  OSP: "OSP",
  AG: "AG",
  WE: "WE",
  CARRIER: "CARRIER",
  Recipient: "Recipient",
  SENDER: "SENDER",
  ZI: "ZI",
  S1: "S1",
  S2: "S2",
  R1: "R1",
  RE: "RE",
  RG: "RG",
  YA: "YA",
  ZE: "ZE",
  OSO: "OSO",
  TIME_BOOKING_CONTACT: "TIME_BOOKING_CONTACT",
  CONTACT_PERSON: "CONTACT_PERSON",
} as const;

export const ComplaintSearchResultViewEnum = {
  COMPLAINT_SEARCH: "COMPLAINT_SEARCH",
  COMPLAINT_ITEM_SEARCH: "COMPLAINT_ITEM_SEARCH",
};

export const ComplaintItemSerialNumberCategory = {
  UNSPECIFIED: "UNSPECIFIED",
  REQUESTED: "REQUESTED",
  POSTED: "POSTED",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type ComplaintTypeEnum =
  typeof ComplaintTypeEnum[keyof typeof ComplaintTypeEnum];
export type ComplaintStatusEnum =
  typeof ComplaintStatusEnum[keyof typeof ComplaintStatusEnum];
export type ComplaintItemTypeEnum =
  typeof ComplaintItemTypeEnum[keyof typeof ComplaintItemTypeEnum];
export type ComplaintItemQuantityRoleCategoryEnum =
  typeof ComplaintItemQuantityRoleCategoryEnum[keyof typeof ComplaintItemQuantityRoleCategoryEnum];
export type ComplaintItemQuantityRoleEnum =
  typeof ComplaintItemQuantityRoleEnum[keyof typeof ComplaintItemQuantityRoleEnum];
export type ComplaintReferenceReferenceTypeEnum =
  typeof ComplaintReferenceReferenceTypeEnum[keyof typeof ComplaintReferenceReferenceTypeEnum];
export type ComplaintItemReferenceReferenceTypeEnum =
  typeof ComplaintItemReferenceReferenceTypeEnum[keyof typeof ComplaintItemReferenceReferenceTypeEnum];
export type ComplaintItemClassificationEnum =
  typeof ComplaintItemClassificationEnum[keyof typeof ComplaintItemClassificationEnum];
export type ComplaintItemDocumentTypeEnum =
  typeof ComplaintItemDocumentTypeEnum[keyof typeof ComplaintItemDocumentTypeEnum];
export type ComplaintItemTimeTypeEnum =
  typeof ComplaintItemTimeTypeEnum[keyof typeof ComplaintItemTimeTypeEnum];
export type ComplaintItemTimeCategoryEnum =
  typeof ComplaintItemTimeCategoryEnum[keyof typeof ComplaintItemTimeCategoryEnum];
export type ComplaintItemStatusCodeEnum =
  typeof ComplaintItemStatusCodeEnum[keyof typeof ComplaintItemStatusCodeEnum];
export type ComplaintItemStatusValueEnum =
  typeof ComplaintItemStatusValueEnum[keyof typeof ComplaintItemStatusValueEnum];
export type ComplaintStatusCodeEnum =
  typeof ComplaintStatusCodeEnum[keyof typeof ComplaintStatusCodeEnum];
export type ComplaintStatusValueEnum =
  typeof ComplaintStatusValueEnum[keyof typeof ComplaintStatusValueEnum];
export type ComplaintTimeTypeEnum =
  typeof ComplaintTimeTypeEnum[keyof typeof ComplaintTimeTypeEnum];
export type ComplaintTimeCategoryEnum =
  typeof ComplaintTimeCategoryEnum[keyof typeof ComplaintTimeCategoryEnum];
export type ComplaintDocumentTypeEnum =
  typeof ComplaintDocumentTypeEnum[keyof typeof ComplaintDocumentTypeEnum];
export type ComplaintPartnerRoleEnum =
  typeof ComplaintPartnerRoleEnum[keyof typeof ComplaintPartnerRoleEnum];
export type ComplaintSearchResultViewEnum =
  typeof ComplaintSearchResultViewEnum[keyof typeof ComplaintSearchResultViewEnum];
export type ComplaintItemSerialNumberCategory =
  typeof ComplaintItemSerialNumberCategory[keyof typeof ComplaintItemSerialNumberCategory];
/* eslint-enable */
