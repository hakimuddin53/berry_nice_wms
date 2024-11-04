export const TransportStatusEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  IN_PLANNING: "IN_PLANNING",
  RELEASED: "RELEASED",
  CLOSED: "CLOSED",
  IN_EXECUTION: "IN_EXECUTION",
  FINISHED: "FINISHED",
} as const;

export const TransportTimeTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  TRANSPORT_START: "TRANSPORT_START",
  TRANSPORT_END: "TRANSPORT_END",
} as const;

export const TransportTimeCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  PLANNED: "PLANNED",
  ACTUAL: "ACTUAL",
} as const;

export const TransportReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  MILEAGE_START: "MILEAGE_START",
  MILEAGE_END: "MILEAGE_END",
  TRANSPORTATION_NOTE: "TRANSPORTATION_NOTE",
  DEVIATION: "DEVIATION",
  DANGEROUS_GOODS: "DANGEROUS_GOODS",
  HIGH_VALUE_CARGO: "HIGH_VALUE_CARGO",
  DOCK: "DOCK",
  LICENSE_PLATE: "LICENSE_PLATE",
  TRANSPORTATION_UNIT_FREIGHT_ORDER: "TRANSPORTATION_UNIT_FREIGHT_ORDER",
  ERP_DELIVERY: "ERP_DELIVERY",
  SALES_ORDER: "SALES_ORDER",
  CARRIER: "CARRIER",
  CONTAINER_NUMBER: "CONTAINER_NUMBER",
  DANGEROUS_GOODS_CHECK: "DANGEROUS_GOODS_CHECK",
  DANGEROUS_GOODS_CHECKED_BY: "DANGEROUS_GOODS_CHECKED_BY",
  TRAILER_LICENSE_PLATE: "TRAILER_LICENSE_PLATE",
} as const;

export const TransportDocumentTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DELIVERY_NOTE: "DELIVERY_NOTE",
  INVOICE: "INVOICE",
  CONSIGNMENT_NOTE: "CONSIGNMENT_NOTE",
  IMAGE: "IMAGE",
  CONSIGNEE_SIGNATURE: "CONSIGNEE_SIGNATURE",
} as const;

export const TransportStatusCodeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  GOODS_ISSUE: "GOODS_ISSUE",
  GOODS_RECEIPT: "GOODS_RECEIPT",
} as const;

export const TransportStatusValueEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  NOT_RELEVANT: "NOT_RELEVANT",
  NOT_STARTED: "NOT_STARTED",
  STARTED: "STARTED",
  PARTIALLY_COMPLETED: "PARTIALLY_COMPLETED",
  COMPLETED: "COMPLETED",
  REFUSED: "REFUSED",
  CANCELED: "CANCELED",
  TRUE: "TRUE",
  FALSE: "FALSE",
  UNDELIVERABLE: "UNDELIVERABLE",
  CONFIRMED_WITH_DEVIATION: "CONFIRMED_WITH_DEVIATION",
} as const;

export const TransportStopItemTypeEnum = {
  INBOUND_DELIVERY: "INBOUND_DELIVERY",
  OUTBOUND_DELIVERY: "OUTBOUND_DELIVERY",
} as const;

export const TransportStopStatusCodeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  ARRIVED_AT_GATE: "ARRIVED_AT_GATE",
  DELIVERY: "DELIVERY",
  NOT_EDITABLE: "NOT_EDITABLE",
  GOODS_ISSUE: "GOODS_ISSUE",
  GOODS_RECEIPT: "GOODS_RECEIPT",
} as const;

export const TransportStopStatusValueEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  NOT_RELEVANT: "NOT_RELEVANT",
  NOT_STARTED: "NOT_STARTED",
  STARTED: "STARTED",
  PARTIALLY_COMPLETED: "PARTIALLY_COMPLETED",
  COMPLETED: "COMPLETED",
  REFUSED: "REFUSED",
  CANCELED: "CANCELED",
  TRUE: "TRUE",
  FALSE: "FALSE",
  UNDELIVERABLE: "UNDELIVERABLE",
  CONFIRMED_WITH_DEVIATION: "CONFIRMED_WITH_DEVIATION",
} as const;

export const TransportStopLoadingEquipmentExchangeCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  PLANNED: "PLANNED",
  ACTUAL: "ACTUAL",
} as const;

export const TransportStopLoadingEquipmentExchangeTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  INBOUND: "INBOUND",
  OUTBOUND: "OUTBOUND",
} as const;

export const TransportStopTimeTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  ARRIVAL: "ARRIVAL",
  UNLOAD_BEGIN: "UNLOAD_BEGIN",
  UNLOAD_END: "UNLOAD_END",
  PROOF_OF_DELIVERY: "PROOF_OF_DELIVERY",
  LOAD_BEGIN: "LOAD_BEGIN",
  LOAD_END: "LOAD_END",
  DEPARTURE: "DEPARTURE",
  PROOF_OF_PICKUP: "PROOF_OF_PICKUP",
} as const;

export const TransportStopTimeCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  PLANNED: "PLANNED",
  ACTUAL: "ACTUAL",
} as const;

export const TransportStopReferenceReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  EXCEPTION: "EXCEPTION",
  REFUSED_REASON: "REFUSED_REASON",
  SAP__MAIN_LOADING_STOP_ID: "SAP__MAIN_LOADING_STOP_ID",
  SAP__MAIN_UNLOADING_STOP_ID: "SAP__MAIN_UNLOADING_STOP_ID",
  SAP__LOADING_STAGE_ID: "SAP__LOADING_STAGE_ID",
  DEVIATION: "DEVIATION",
  SAP__UNLOADING_STAGE_ID: "SAP__UNLOADING_STAGE_ID",
  TRANSPORTATION_NOTE: "TRANSPORTATION_NOTE",
  DRIVING_DISTANCE: "DRIVING_DISTANCE",
} as const;

export const TransportStopPartnerRoleEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  STOP_LOCATION: "STOP_LOCATION",
  LOADING_EQUIPMENT_PARTNER: "LOADING_EQUIPMENT_PARTNER",
} as const;

export const TransportStopDocumentTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DELIVERY_NOTE: "DELIVERY_NOTE",
  INVOICE: "INVOICE",
  CONSIGNMENT_NOTE: "CONSIGNMENT_NOTE",
  IMAGE: "IMAGE",
  CONSIGNMENT_SIGNATURE: "CONSIGNMENT_SIGNATURE",
} as const;

export const TransportUnitPartnerRoleEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  SENDER: "SENDER",
  RECEIVER: "RECEIVER",
};

export const TransportUnitTimeTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  TEST: "TEST",
  UNDEFINED: "UNDEFINED",
  ARRIVAL_IN_YARD: "ARRIVAL_IN_YARD",
  WSHDRLFDAT: "WSHDRLFDAT",
  WSHDRWADTI: "WSHDRWADTI",
  WSHDRTDDAT: "WSHDRTDDAT",
  WSHDRWADAT: "WSHDRWADAT",
  WSHDRLDDAT: "WSHDRLDDAT",
  WSHDRKODAT: "WSHDRKODAT",
  SHIPPING_DATE: "SHIPPING_DATE",
  DELIVERY_DATE: "DELIVERY_DATE",
  PICKED_REPORTED: "PICKED_REPORTED",
};

export const TransportUnitTimeCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  PLANNED: "PLANNED",
  ACTUAL: "ACTUAL",
};

export const TransportPartnerRoleEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DRIVER: "DRIVER",
  SUPPLIER: "SUPPLIER",
};

export const TransportTextTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  TEST: "TEST",
  TEXT: "TEXT",
};

/* eslint-disable @typescript-eslint/no-redeclare */
export type TransportStatusEnum =
  typeof TransportStatusEnum[keyof typeof TransportStatusEnum];
export type TransportTimeTypeEnum =
  typeof TransportTimeTypeEnum[keyof typeof TransportTimeTypeEnum];
export type TransportTimeCategoryEnum =
  typeof TransportTimeCategoryEnum[keyof typeof TransportTimeCategoryEnum];
export type TransportReferenceTypeEnum =
  typeof TransportReferenceTypeEnum[keyof typeof TransportReferenceTypeEnum];
export type TransportDocumentTypeEnum =
  typeof TransportDocumentTypeEnum[keyof typeof TransportDocumentTypeEnum];
export type TransportStatusValueEnum =
  typeof TransportStatusValueEnum[keyof typeof TransportStatusValueEnum];
export type TransportStopItemTypeEnum =
  typeof TransportStopItemTypeEnum[keyof typeof TransportStopItemTypeEnum];
export type TransportStopStatusCodeEnum =
  typeof TransportStopStatusCodeEnum[keyof typeof TransportStopStatusCodeEnum];
export type TransportStatusCodeEnum =
  typeof TransportStatusCodeEnum[keyof typeof TransportStatusCodeEnum];
export type TransportStopStatusValueEnum =
  typeof TransportStopStatusValueEnum[keyof typeof TransportStopStatusValueEnum];
export type TransportStopLoadingEquipmentExchangeCategoryEnum =
  typeof TransportStopLoadingEquipmentExchangeCategoryEnum[keyof typeof TransportStopLoadingEquipmentExchangeCategoryEnum];
export type TransportStopLoadingEquipmentExchangeTypeEnum =
  typeof TransportStopLoadingEquipmentExchangeTypeEnum[keyof typeof TransportStopLoadingEquipmentExchangeTypeEnum];
export type TransportStopTimeTypeEnum =
  typeof TransportStopTimeTypeEnum[keyof typeof TransportStopTimeTypeEnum];
export type TransportStopTimeCategoryEnum =
  typeof TransportStopTimeCategoryEnum[keyof typeof TransportStopTimeCategoryEnum];
export type TransportStopReferenceReferenceTypeEnum =
  typeof TransportStopReferenceReferenceTypeEnum[keyof typeof TransportStopReferenceReferenceTypeEnum];
export type TransportStopPartnerRoleEnum =
  typeof TransportStopPartnerRoleEnum[keyof typeof TransportStopPartnerRoleEnum];
export type TransportStopDocumentTypeEnum =
  typeof TransportStopDocumentTypeEnum[keyof typeof TransportStopDocumentTypeEnum];
export type TransportUnitPartnerRoleEnum =
  typeof TransportUnitPartnerRoleEnum[keyof typeof TransportUnitPartnerRoleEnum];
export type TransportUnitTimeTypeEnum =
  typeof TransportUnitTimeTypeEnum[keyof typeof TransportUnitTimeTypeEnum];
export type TransportUnitTimeCategoryEnum =
  typeof TransportUnitTimeCategoryEnum[keyof typeof TransportUnitTimeCategoryEnum];
export type TransportPartnerRoleEnum =
  typeof TransportPartnerRoleEnum[keyof typeof TransportPartnerRoleEnum];
export type TransportTextTypeEnum =
  typeof TransportTextTypeEnum[keyof typeof TransportTextTypeEnum];
/* eslint-enable */
