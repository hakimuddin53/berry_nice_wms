export const YardResourceStatusEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;

export const YardResourceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  TRUCK: "TRUCK",
  SEMI_TRAILER: "SEMI_TRAILER",
  SWAP_BODY: "SWAP_BODY",
  CONTAINER: "CONTAINER",
  TRACTOR: "TRACTOR",
  TRAILER: "TRAILER",
} as const;

export const YardResourceReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
} as const;

export const YardResourceActionCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  PLANNED: "PLANNED",
  ACTUAL: "ACTUAL",
} as const;

export const YardResourceTimeCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  PLANNED: "PLANNED",
  ACTUAL: "ACTUAL",
} as const;

export const YardResourceTimeTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  TEST: "TEST",
  UNDEFINED: "UNDEFINED",
  ARRIVAL_IN_YARD: "ARRIVAL_IN_YARD",
  ARRIVAL_IN_YARD_EARLYEST: "ARRIVAL_IN_YARD_EARLYEST",
  ARRIVAL_IN_YARD_LATEST: "ARRIVAL_IN_YARD_LATEST",
  YARD_EXIT: "YARD_EXIT",
  WSHDRLFDAT: "WSHDRLFDAT",
  WSHDRWADTI: "WSHDRWADTI",
} as const;

export const YardPositionReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  SMS_RELEVANCE: "SMS_RELEVANCE",
} as const;

export const YardLinkTypeResourceEnum = {
  UNDEFINED: "UNDEFINED",
  FIXED: "FIXED",
  LOOSE: "LOOSE",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type YardResourceStatusEnum =
  typeof YardResourceStatusEnum[keyof typeof YardResourceStatusEnum];
export type YardResourceTypeEnum =
  typeof YardResourceTypeEnum[keyof typeof YardResourceTypeEnum];
export type YardResourceReferenceTypeEnum =
  typeof YardResourceReferenceTypeEnum[keyof typeof YardResourceReferenceTypeEnum];
export type YardResourceActionCategoryEnum =
  typeof YardResourceActionCategoryEnum[keyof typeof YardResourceActionCategoryEnum];
export type YardResourceTimeCategoryEnum =
  typeof YardResourceTimeCategoryEnum[keyof typeof YardResourceTimeCategoryEnum];
export type YardResourceTimeTypeEnum =
  typeof YardResourceTimeTypeEnum[keyof typeof YardResourceTimeTypeEnum];
export type YardPositionReferenceTypeEnum =
  typeof YardPositionReferenceTypeEnum[keyof typeof YardPositionReferenceTypeEnum];
export type YardLinkTypeResourceEnum =
  typeof YardLinkTypeResourceEnum[keyof typeof YardLinkTypeResourceEnum];
/* eslint-enable */
