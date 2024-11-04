export const HandlingUnitTypeLocationReferenceEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  SHIPPING_QTY_PER_PALLET: "SHIPPING_QTY_PER_PALLET",
  ONLY_RECEIVE_FULL_SHIPPING_UNITS: "ONLY_RECEIVE_FULL_SHIPPING_UNITS",
} as const;

export const HandlingUnitTypeReferenceReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  PACKING_PRICE: "PACKING_PRICE",
  ALTERNATIVE_CONTAINER_TYPE: "ALTERNATIVE_CONTAINER_TYPE",
  ADD_DURING_GOODS_ISSUE_ALLOWED: "ADD_DURING_GOODS_ISSUE_ALLOWED",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type HandlingUnitTypeLocationReferenceEnum =
  typeof HandlingUnitTypeLocationReferenceEnum[keyof typeof HandlingUnitTypeLocationReferenceEnum];
export type HandlingUnitTypeReferenceReferenceTypeEnum =
  typeof HandlingUnitTypeReferenceReferenceTypeEnum[keyof typeof HandlingUnitTypeReferenceReferenceTypeEnum];
/* eslint-enable */
