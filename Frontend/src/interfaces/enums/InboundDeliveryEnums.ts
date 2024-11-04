export const InboundDeliveryDocumentTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  INB: "INB",
  TEST: "TEST",
  EL: "EL",
  IMAGE: "IMAGE",
  LB: "LB",
  TRANSFER: "TRANSFER",
  ENHANCED: "ENHANCED",
  SUBCONTRACTING_INB_DEL: "SUBCONTRACTING_INB_DEL",
  RT: "RT",
  RELEASE_ORDER: "RELEASE_ORDER",
  CONSIGNMENT_FILL_UP_ORDER: "CONSIGNMENT_FILL_UP_ORDER",
  CUSTOMER_CONSIGNMENT_RETURNS: "CUSTOMER_CONSIGNMENT_RETURNS",
  ZANL: "ZANL",
  TRANSFER_INBOUND_DELIVERY: "TRANSFER_INBOUND_DELIVERY",
  VMI_ORDERS: "VMI_ORDERS",
  KIT_RETURNS: "KIT_RETURNS",
  LR: "LR",
  SHIPPING_ORDER: "SHIPPING_ORDER",
} as const;

export const InboundDeliveryStatusEnum = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;

export const InboundDeliveryStatusCodeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  CLOSE_DELIVERY: "CLOSE_DELIVERY",
  CANCELED: "CANCELED",
  TIME_SLOT_BOOKING: "TIME_SLOT_BOOKING",
} as const;

export const InboundDeliveryStatusValueEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  NOT_RELEVANT: "NOT_RELEVANT",
  NOT_STARTED: "NOT_STARTED",
  PARTIALLY_COMPLETED: "PARTIALLY_COMPLETED",
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
} as const;

export const InboundDeliveryReferenceReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  TEST: "TEST",
  ROUTE: "ROUTE",
  TRANS_CAT: "TRANS_CAT",
  TRANSP_ID: "TRANSP_ID",
  EXTDELV_NO: "EXTDELV_NO",
  GEOROUTE: "GEOROUTE",
  IDOC_NUMBER: "IDOC_NUMBER",
  ExternalReferenceChanged: "ExternalReferenceChanged",
  PURCHASE_ORDER: "PURCHASE_ORDER",
  DELIVERY_NUMBER: "DELIVERY_NUMBER",
  LICENCEPLATENUMBER: "LICENCEPLATENUMBER",
  SEAL: "SEAL",
  CONTAINER_NUMBER: "CONTAINER_NUMBER",
  DEPARTMENT: "DEPARTMENT",
  VENDOR_NAME: "VENDOR_NAME",
  DOOR: "DOOR ",
  CONTAINER_SIZE: "CONTAINER_SIZE",
  PSI_LAGERORT: "PSI_LAGERORT",
  AGENT: "AGENT",
  SUPPLIER_MATERIAL_NUMBER: "SUPPLIER_MATERIAL_NUMBER",
  BATCH: "BATCH",
  SUPPLIER_NUMBER: "SUPPLIER_NUMBER",
  MANUAL_SUPPLIER: "MANUAL_SUPPLIER",
  WAREHOUSE_NUMBER_HOST: "WAREHOUSE_NUMBER_HOST",
  EXT_SYS_DOC_ID: "EXT_SYS_DOC_ID",
  EXT_SYS_DOC_REFERENCE_NO: "EXT_SYS_DOC_REFERENCE_NO",
  EXT_SYS_DOC_TYPE: "EXT_SYS_DOC_TYPE",
  REASON_FOR_DELAY: "REASON_FOR_DELAY",
  OUTBOUND_DELIVERY: "OUTBOUND_DELIVERY",
  DEVIATION: "DEVIATION",
  SALES_ORDER: "SALES_ORDER",
  TRANSPORTATION_NOTE: "TRANSPORTATION_NOTE",
  INCOTERMS1: "INCOTERMS1",
  INCOTERMS2: "INCOTERMS2",
  SHIP_COND: "SHIP_COND",
  GRGISLIP_NO: "GRGISLIP_NO",
  BILLOFLADING: "BILLOFLADING",
  CUST_GROUP: "CUST_GROUP",
  ROUTESCHED: "ROUTESCHED",
  PREV_DOC_NO: "PREV_DOC_NO",
  PREV_DOC_TYPE: "PREV_DOC_TYPE",
  SD_DOC_CAT_LONG: "SD_DOC_CAT_LONG",
  INCOTERMSV: "INCOTERMSV",
  INCOTERMS2L: "INCOTERMS2L",
  INCOTERMS3L: "INCOTERMS3L",
  RFM_PSST_GROUP: "RFM_PSST_GROUP",
  SALES_OFF: "SALES_OFF",
  SALES_DIST: "SALES_DIST",
  UNLOAD_PT: "UNLOAD_PT",
} as const;

export const InboundDeliveryTimeTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  TEST: "TEST",
  UNDEFINED: "UNDEFINED",
  ARRIVAL_IN_YARD: "ARRIVAL_IN_YARD",
  WSHDRLFDAT: "WSHDRLFDAT",
  WSHDRWADTI: "WSHDRWADTI",
  WSHDRTDDAT: "WSHDRTDDAT",
  LADDER_PLAN_DATE: "LADDER_PLAN_DATE",
  PLDELDATE: "PLDELDATE",
  ORDERDATE: "ORDERDATE",
  DELIVERED: "DELIVERED",
  PICKUP: "PICKUP",
  WSHDRWADAT: "WSHDRWADAT",
  WSHDRLDDAT: "WSHDRLDDAT",
  WSHDRKODAT: "WSHDRKODAT",
  LADETERMIN: "LADETERMIN",
  ZUSTELLTERMIN: "ZUSTELLTERMIN",
  SHIPPING_DATE: "SHIPPING_DATE",
  DELIVERY_DATE: "DELIVERY_DATE",
  DOCUMENT_DATE: "DOCUMENT_DATE",
  CHECK_IN_TIME: "CHECK_IN_TIME",
  VACCINATION_TIME: "VACCINATION_TIME",
  CHECK_OUT_TIME: "CHECK_OUT_TIME",
  NOT_VACCINATED: "NOT_VACCINATED",
  CANCELLED: "CANCELLED",
  VACCINATION_TIME_REVERSED: "VACCINATION_TIME_REVERSED",
  VACCINATION_REVERSED: "VACCINATION_REVERSED",
  PICKED_REPORTED: "PICKED_REPORTED",
  PROCEDURE_DATE: "PROCEDURE_DATE",
  CLOSED: "CLOSED",
  ACCEPTANCE_DENIED: "ACCEPTANCE_DENIED",
  TIME_BOOKING_FROM: "TIME_BOOKING_FROM",
  TIME_BOOKING_UNTIL: "TIME_BOOKING_UNTIL",
  EARLIEST_TIME_SLOT: "EARLIEST_TIME_SLOT",
  LATEST_TIME_SLOT: "LATEST_TIME_SLOT",
} as const;

export const InboundDeliveryTimeCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  UNDEFINED: "UNDEFINED",
  PLANNED: "PLANNED",
  ACTUAL: "ACTUAL",
} as const;

export const InboundDeliveryPartnerRoleEnum = {
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
  TIME_BOOKING_CONTACT_SECONDARY: "TIME_BOOKING_CONTACT_SECONDARY",
} as const;

export const InboundDeliveryPartnerRefReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  TEST: "TEST",
  DESC_PARTN: "DESC_PARTN",
  SCA_CODE: "SCA_CODE",
  NAME_4: "NAME_4",
  C_O_NAME: "C_O_NAME",
  DISTRICT: "DISTRICT",
  CITY_NO: "CITY_NO",
  DELIV_DIS: "DELIV_DIS",
  STREET_NO: "STREET_NO",
  STR_ABBR: "STR_ABBR",
  STR_SUPPL1: "STR_SUPPL1",
  STR_SUPPL2: "STR_SUPPL2",
  LOCATION: "LOCATION",
  BUILDING: "BUILDING",
  FLOOR: "FLOOR",
  ROOM_NO: "ROOM_NO",
  SORT1: "SORT1",
  SORT2: "SORT2",
  TAXJURCODE: "TAXJURCODE",
  ADR_NOTES: "ADR_NOTES",
  COMM_TYPE: "COMM_TYPE",
  FAX_NUMBER: "FAX_NUMBER",
  FAX_EXTENS: "FAX_EXTENS",
  STREET_LNG: "STREET_LNG",
  DISTRCT_NO: "DISTRCT_NO",
  CHCKSTATUS: "CHCKSTATUS",
  PBOXCIT_NO: "PBOXCIT_NO",
  HOUSE_NO2: "HOUSE_NO2",
} as const;

export const InboundDeliveryQuantityQuantityRoleCategoryEnum = {
  REQUESTED: "REQUESTED",
  EXECUTED: "EXECUTED",
  OPEN: "OPEN",
} as const;

export const InboundDeliveryQuantityQuantityRoleEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  UNDEFINED: "UNDEFINED",
  NET_WEIGHT: "NET_WEIGHT",
  GROSS_WEIGHT: "GROSS_WEIGHT",
  VOLUME: "VOLUME",
  CAPACITY: "CAPACITY",
  AMOUNT_OF_PARCELS: "AMOUNT_OF_PARCELS",
  NOSHPUNITS: "NOSHPUNITS",
  TOTAL_WEIGHT: "TOTAL_WEIGHT",
} as const;

export const InboundDeliveryTextTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  TEST: "TEST",
  TEXT: "TEXT",
} as const;

export const InboundDeliveryItemTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  TEST: "TEST",
  ELN: "ELN",
  TAN: "TAN",
  ZANL: "ZANL",
  DLN: "DLN",
  ZZAN: "ZZAN",
  REN: "REN",
} as const;

export const InboundDeliveryItemClassificationEnum = {
  MATERIAL: "MATERIAL",
  CONTAINER: "CONTAINER",
} as const;

export const InboundDeliveryItemCreditDecisionEnum = {
  NO_CREDIT: "NO_CREDIT",
  FULL_CREDIT: "FULL_CREDIT",
} as const;

export const InboundDeliveryItemInspectionResultEnum = {
  LIKE_NEW: "LIKE_NEW",
  ONE_SCRATCH: "ONE_SCRATCH",
  MORE_THAN_ONE_SCRATCH: "MORE_THAN_ONE_SCRATCH",
  DIRTY: "DIRTY",
} as const;

export const InboundDeliveryItemFollowUpEnum = {
  INDUSTRIAL_RETURNS: "INDUSTRIAL_RETURNS",
  BACK_TO_CUSTOMER: "BACK_TO_CUSTOMER",
  SCRAP: "SCRAP",
  STORE_BACK: "STORE_BACK",
} as const;

export const InboundDeliveryItemQuantityRoleCategoryEnum = {
  REQUESTED: "REQUESTED",
  EXECUTED: "EXECUTED",
  OPEN: "OPEN",
} as const;

export const InboundDeliveryItemQuantityRoleEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  UNDEFINED: "UNDEFINED",
  NET_WEIGHT: "NET_WEIGHT",
  GROSS_WEIGHT: "GROSS_WEIGHT",
  VOLUME: "VOLUME",
  CAPACITY: "CAPACITY",
  AMOUNT_OF_PARCELS: "AMOUNT_OF_PARCELS",
  DLV_QTY_SALES: "DLV_QTY_SALES",
  DLV_QTY_STOCK: "DLV_QTY_STOCK8",
  CUMBTCHQTYSU_FLO: "CUMBTCHQTYSU_FLO",
  GROSS_WT: "GROSS_WT",
  CUM_BTCH_QTY: "CUM_BTCH_QTY",
  CUM_BTCH_GR_WT: "CUM_BTCH_GR_WT",
  CUM_BTCH_NT_WT: "CUM_BTCH_NT_WT",
  CUM_BTCH_VOL: "CUM_BTCH_VOL",
  CUMBTCHQTYSU: "CUMBTCHQTYSU",
  GR: "GR",
  TRANSPORT: "TRANSPORT",
  SCANNED: "SCANNED",
} as const;

export const InboundDeliveryItemStatusCodeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  TEST: "TEST",
  CONSIGNMENT_NOTE: "CONSIGNMENT_NOTE",
} as const;

export const InboundDeliveryItemStatusValueEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  NOT_RELEVANT: "NOT_RELEVANT",
  NOT_STARTED: "NOT_STARTED",
  PARTIALLY_COMPLETED: "PARTIALLY_COMPLETED",
  COMPLETED: "COMPLETED",
  CLOSED: "CLOSED",
} as const;

export const InboundDeliveryItemDocumentTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  IMAGE: "IMAGE",
  DOCUMENT: "DOCUMENT",
  OTHER: "OTHER",
  TEST: "TEST",
} as const;

export const InboundDeliveryItemPartnerRoleEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  TEST: "TEST",
} as const;

export const InboundDeliveryItemTextTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  TEST: "TEST",
  TEXT: "TEXT",
} as const;

export const InboundDeliveryItemTimeTypeEynum = {
  UNSPECIFIED: "UNSPECIFIED",
  UNDEFINED: "UNDEFINED",
  ARRIVAL_IN_YARD: "ARRIVAL_IN_YARD",
  LADDER_PLAN_DATE: "LADDER_PLAN_DATE",
  DELIVERY: "DELIVERY",
  DISPATCH_SENDER: "DISPATCH_SENDER",
} as const;

export const InboundDeliveryItemTimeCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  UNDEFINED: "UNDEFINED",
  PLANNED: "PLANNED",
  ACTUAL: "ACTUAL",
  EXPECTED: "EXPECTED",
} as const;

export const InboundDeliverySerialNumberCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  ANNOUNCED: "ANNOUNCED",
  POSTED: "POSTED",
} as const;

export const InboundDeliveryItemReferenceReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  UNDEFINED: "UNDEFINED",
  ASN: "ASN",
  ERP_ORIGINAL_DOCUMENT: "ERP_ORIGINAL_DOCUMENT",
  ERP_DOCUMENT: "ERP_DOCUMENT",
  DOC_NUMBER: "DOC_NUMBER",
  ITM_NUMBER_REF: "ITM_NUMBER_REF",
  SD_DOC_CAT: "SD_DOC_CAT",
  DOC_CAT: "DOC_CAT",
  DOC_TYPE: "DOC_TYPE",
  CTRL_IND: "CTRL_IND",
  DELETE_IND: "DELETE_IND",
  STATUS: "STATUS",
  PURCH_ORG: "PURCH_ORG",
  PUR_GROUP: "PUR_GROUP",
  DOC_DATE: "DOC_DATE",
  NO_MORE_GR: "NO_MORE_GR",
  ITEM_CAT: "ITEM_CAT",
  GR_IND: "GR_IND",
  GR_NON_VAL: "GR_NON_VAL",
  GR_BASEDIV: "GR_BASEDIV",
  GRSETTFROM: "GRSETTFROM",
  USR01: "USR01",
  USR02: "USR02",
  USR03: "USR03",
  USR04: "USR04",
  USR05: "USR05",
  BATCH: "BATCH",
  SPE_EXT_ID: "SPE_EXT_ID",
  SPE_EXT_ID_ITEM: "SPE_EXT_ID_ITEM",
  SHORT_TEXT: "SHORT_TEXT",
  VEND_MAT: "VEND_MAT",
  USEHIERITM: "USEHIERITM",
  LOADINGGRP: "LOADINGGRP",
  TRANS_GRP: "TRANS_GRP",
  DLV_GROUP: "DLV_GROUP",
  REC_POINT: "REC_POINT",
  MATFRGTGRP: "MATFRGTGRP",
  OVERDEL_UNLIM: "OVERDEL_UNLIM",
  OVERDELTOL: "OVERDELTOL",
  UNDER_TOL: "UNDER_TOL",
  BTCH_SPLIT: "BTCH_SPLIT",
  BTCHEVALTYP: "BTCHEVALTYP",
  PACKCNTRL: "PACKCNTRL",
  MAT_GRP_SM: "MAT_GRP_SM",
  DB_CR_IND: "DB_CR_IND",
  PROMOTION: "PROMOTION",
  EXPIRYDATE: "EXPIRYDATE",
  MOVE_TYPE_WM: "MOVE_TYPE_WM",
  MATL_GROUP: "MATL_GROUP",
  MATL_TYPE: "MATL_TYPE",
  DEL_QTY_FLO: "DEL_QTY_FLO",
  CONV_FACT: "CONV_FACT",
  DLV_QTY_ST_FLO: "DLV_QTY_ST_FLO",
  FLG_LEAD_UNIT: "FLG_LEAD_UNIT",
  VAL_TYPE: "VAL_TYPE",
  MATERIAL_EXTERNAL: "MATERIAL_EXTERNAL",
  MATERIAL_GUID: "MATERIAL_GUID",
  MATERIAL_VERSION: "MATERIAL_VERSION",
  INSPLOT: "INSPLOT",
  PROD_DATE: "PROD_DATE",
  CURR_QTY: "CURR_QTY",
  STK_SEGMENT: "STK_SEGMENT",
  MATERIAL_LONG: "MATERIAL_LONG",
  STK_SEG_LONG: "STK_SEG_LONG",
  LINE_NUMBER: "LINE_NUMBER",
  FREE_TEXT_1: "FREE_TEXT_1",
  FREE_TEXT_2: "FREE_TEXT_2",
  PURCHASE_ORDER_ITEM: "PURCHASE_ORDER_ITEM",
  PURCHASE_ORDER: "PURCHASE_ORDER",
  VENDOR_NAME: "VENDOR_NAME",
  DEPARTMENT: "DEPARTMENT",
  CONTAINER_SIZE: "CONTAINER_SIZE",
  MATERIAL_DESC_1: "MATERIAL_DESC_1",
  MATERIAL_DESC_2: "MATERIAL_DESC_2",
  TRANSFER_FROM_CODE: "TRANSFER_FROM_CODE",
  TRANSFER_TO_CODE: "TRANSFER_TO_CODE",
  STORAGE_LOCATION: "STORAGE_LOCATION",
  EXT_SYS_DOC_ID: "EXT_SYS_DOC_ID",
  DEVIATION: "DEVIATION",
  SALES_ORDER: "SALES_ORDER",
  TRANSPORTATION_NOTE: "TRANSPORTATION_NOTE",
  MAT_ENTRD: "MAT_ENTRD",
  CUST_MAT: "CUST_MAT",
  STGE_BIN: "STGE_BIN",
  BOMEXPL_NO: "BOMEXPL_NO",
  PART_DLV: "PART_DLV",
  ENVT_RLVT: "ENVT_RLVT",
  PROD_HIER: "PROD_HIER",
  MATL_GRP_1: "MATL_GRP_1",
  MATL_GRP_2: "MATL_GRP_2",
  MATL_GRP_3: "MATL_GRP_3",
  MATL_GRP_4: "MATL_GRP_4",
  MATL_GRP_5: "MATL_GRP_5",
  CUST_GRP2: "CUST_GRP2",
  CUST_GRP3: "CUST_GRP3",
  CUST_GRP4: "CUST_GRP4",
  CUST_GRP5: "CUST_GRP5",
  CUST_GRP1: "CUST_GRP1",
  SALES_QTY_DENOM: "SALES_QTY_DENOM",
  SALES_QTY_NUM: "SALES_QTY_NUM",
  MAT_ENTRD_EXTERNAL: "MAT_ENTRD_EXTERNAL",
  MAT_ENTRD_GUID: "MAT_ENTRD_GUID",
  MAT_ENTRD_VERSION: "MAT_ENTRD_VERSION",
  REQ_SEGMENT: "REQ_SEGMENT",
  MAT_ENTRD_LONG: "MAT_ENTRD_LONG",
  SALES_OFF: "SALES_OFF",
  SALES_GRP: "SALES_GRP",
  DISTR_CHAN: "DISTR_CHAN",
  DIVISION: "DIVISION",
  RFO_DOC_NUMBER: "RFO_DOC_NUMBER",
  RFO_ITM_NUMBER_REF: "RFO_ITM_NUMBER_REF",
  RFO_SD_DOC_CAT: "RFO_SD_DOC_CAT",
  RFO_DOC_DATE: "RFO_DOC_DATE",
  RFO_PURCH_NO_C: "RFO_PURCH_NO_C",
  RFO_PURCH_DATE: "RFO_PURCH_DATE",
  RFO_PO_METHOD: "RFO_PO_METHOD",
  RFO_REF_1: "RFO_REF_1",
  RFO_PO_ITM_NO: "RFO_PO_ITM_NO",
  RFO_PURCH_NO_S: "RFO_PURCH_NO_S",
  RFO_PO_DAT_S: "RFO_PO_DAT_S",
  RFO_PO_METH_S: "RFO_PO_METH_S",
  RFO_REF_1_S: "RFO_REF_1_S",
  RFO_PO_ITM_NO_S: "RFO_PO_ITM_NO_S",
  RFO_CONSUMPPNT: "RFO_CONSUMPPNT",
  RFO_USR01: "RFO_USR01",
  RFO_USR02: "RFO_USR02",
  RFO_USR03: "RFO_USR03",
  RFO_USR04: "RFO_USR04",
  RFO_USR05: "RFO_USR05",
  RFO_DLVSCHEDNO: "RFO_DLVSCHEDNO",
  RFO_DLVSCHEDDATE: "RFO_DLVSCHEDDATE",
  RFO_DLVSCHEDUSE: "RFO_DLVSCHEDUSE",
  RFO_CUSTCHNGSTATUS: "RFO_CUSTCHNGSTATUS",
  RFO_SUBSTREASON: "RFO_SUBSTREASON",
  CONV_UNIT_NOM: "CONV_UNIT_NOM",
  CONV_UNIT_DENOM: "CONV_UNIT_DENOM",
} as const;

export const InboundDeliveryItemPartnerRefReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  TEST: "TEST",
  DESC_PARTN: "DESC_PARTN",
  SCA_CODE: "SCA_CODE",
  NAME_4: "NAME_4",
  C_O_NAME: "C_O_NAME",
  DISTRICT: "DISTRICT",
  CITY_NO: "CITY_NO",
  DELIV_DIS: "DELIV_DIS",
  STREET_NO: "STREET_NO",
  STR_ABBR: "STR_ABBR",
  STR_SUPPL1: "STR_SUPPL1",
  STR_SUPPL2: "STR_SUPPL2",
  LOCATION: "LOCATION",
  BUILDING: "BUILDING",
  FLOOR: "FLOOR",
  ROOM_NO: "ROOM_NO",
  SORT1: "SORT1",
  SORT2: "SORT2",
  TAXJURCODE: "TAXJURCODE",
  ADR_NOTES: "ADR_NOTES",
  COMM_TYPE: "COMM_TYPE",
  FAX_NUMBER: "FAX_NUMBER",
  FAX_EXTENS: "FAX_EXTENS",
  STREET_LNG: "STREET_LNG",
  DISTRCT_NO: "DISTRCT_NO",
  CHCKSTATUS: "CHCKSTATUS",
  PBOXCIT_NO: "PBOXCIT_NO",
  HOUSE_NO2: "HOUSE_NO2",
} as const;

export const InboundDeliverySerialNumberCategory = {
  UNSPECIFIED: "UNSPECIFIED",
  ANNOUNCED: "ANNOUNCED",
  POSTED: "POSTED",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type InboundDeliveryDocumentTypeEnum =
  typeof InboundDeliveryDocumentTypeEnum[keyof typeof InboundDeliveryDocumentTypeEnum];
export type InboundDeliveryStatusEnum =
  typeof InboundDeliveryStatusEnum[keyof typeof InboundDeliveryStatusEnum];
export type InboundDeliveryStatusCodeEnum =
  typeof InboundDeliveryStatusCodeEnum[keyof typeof InboundDeliveryStatusCodeEnum];
export type InboundDeliveryStatusValueEnum =
  typeof InboundDeliveryStatusValueEnum[keyof typeof InboundDeliveryStatusValueEnum];
export type InboundDeliveryReferenceReferenceTypeEnum =
  typeof InboundDeliveryReferenceReferenceTypeEnum[keyof typeof InboundDeliveryReferenceReferenceTypeEnum];
export type InboundDeliveryTimeTypeEnum =
  typeof InboundDeliveryTimeTypeEnum[keyof typeof InboundDeliveryTimeTypeEnum];
export type InboundDeliveryTimeCategoryEnum =
  typeof InboundDeliveryTimeCategoryEnum[keyof typeof InboundDeliveryTimeCategoryEnum];
export type InboundDeliveryPartnerRoleEnum =
  typeof InboundDeliveryPartnerRoleEnum[keyof typeof InboundDeliveryPartnerRoleEnum];
export type InboundDeliveryPartnerRefReferenceTypeEnum =
  typeof InboundDeliveryPartnerRefReferenceTypeEnum[keyof typeof InboundDeliveryPartnerRefReferenceTypeEnum];
export type InboundDeliveryQuantityQuantityRoleCategoryEnum =
  typeof InboundDeliveryQuantityQuantityRoleCategoryEnum[keyof typeof InboundDeliveryQuantityQuantityRoleCategoryEnum];
export type InboundDeliveryQuantityQuantityRoleEnum =
  typeof InboundDeliveryQuantityQuantityRoleEnum[keyof typeof InboundDeliveryQuantityQuantityRoleEnum];
export type InboundDeliveryTextTypeEnum =
  typeof InboundDeliveryTextTypeEnum[keyof typeof InboundDeliveryTextTypeEnum];
export type InboundDeliveryItemTypeEnum =
  typeof InboundDeliveryItemTypeEnum[keyof typeof InboundDeliveryItemTypeEnum];
export type InboundDeliveryItemClassificationEnum =
  typeof InboundDeliveryItemClassificationEnum[keyof typeof InboundDeliveryItemClassificationEnum];
export type InboundDeliveryItemCreditDecisionEnum =
  typeof InboundDeliveryItemCreditDecisionEnum[keyof typeof InboundDeliveryItemCreditDecisionEnum];
export type InboundDeliveryItemInspectionResultEnum =
  typeof InboundDeliveryItemInspectionResultEnum[keyof typeof InboundDeliveryItemInspectionResultEnum];
export type InboundDeliveryItemFollowUpEnum =
  typeof InboundDeliveryItemFollowUpEnum[keyof typeof InboundDeliveryItemFollowUpEnum];
export type InboundDeliveryItemQuantityRoleCategoryEnum =
  typeof InboundDeliveryItemQuantityRoleCategoryEnum[keyof typeof InboundDeliveryItemQuantityRoleCategoryEnum];
export type InboundDeliveryItemQuantityRoleEnum =
  typeof InboundDeliveryItemQuantityRoleEnum[keyof typeof InboundDeliveryItemQuantityRoleEnum];
export type InboundDeliveryItemStatusCodeEnum =
  typeof InboundDeliveryItemStatusCodeEnum[keyof typeof InboundDeliveryItemStatusCodeEnum];
export type InboundDeliveryItemStatusValueEnum =
  typeof InboundDeliveryItemStatusValueEnum[keyof typeof InboundDeliveryItemStatusValueEnum];
export type InboundDeliveryItemDocumentTypeEnum =
  typeof InboundDeliveryItemDocumentTypeEnum[keyof typeof InboundDeliveryItemDocumentTypeEnum];
export type InboundDeliveryItemPartnerRoleEnum =
  typeof InboundDeliveryItemPartnerRoleEnum[keyof typeof InboundDeliveryItemPartnerRoleEnum];
export type InboundDeliveryItemTextTypeEnum =
  typeof InboundDeliveryItemTextTypeEnum[keyof typeof InboundDeliveryItemTextTypeEnum];
export type InboundDeliveryItemTimeTypeEynum =
  typeof InboundDeliveryItemTimeTypeEynum[keyof typeof InboundDeliveryItemTimeTypeEynum];
export type InboundDeliveryItemTimeCategoryEnum =
  typeof InboundDeliveryItemTimeCategoryEnum[keyof typeof InboundDeliveryItemTimeCategoryEnum];
export type InboundDeliverySerialNumberCategoryEnum =
  typeof InboundDeliverySerialNumberCategoryEnum[keyof typeof InboundDeliverySerialNumberCategoryEnum];
export type InboundDeliveryItemPartnerRefReferenceTypeEnum =
  typeof InboundDeliveryItemPartnerRefReferenceTypeEnum[keyof typeof InboundDeliveryItemPartnerRefReferenceTypeEnum];
export type InboundDeliveryItemReferenceReferenceTypeEnum =
  typeof InboundDeliveryItemReferenceReferenceTypeEnum[keyof typeof InboundDeliveryItemReferenceReferenceTypeEnum];
export type InboundDeliverySerialNumberCategory =
  typeof InboundDeliverySerialNumberCategory[keyof typeof InboundDeliverySerialNumberCategory];
/* eslint-enable */
