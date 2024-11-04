import { LengthUnits, MassUnits, VolumeUnits } from "unitsnet-js";

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

export const StockUsageEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  Kundenkonsignation: "Kundenkonsignation",
  Leihgut: "Leihgut",
  Transportverpackung: "Transportverpackung",
} as const;

export const StockCategoryEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  FreiVerwendbar: "FreiVerwendbar",
  Gesperrt: "Gesperrt",
  Beliebig: "Beliebig",
  Fest: "Fest",
};

export const SerialNumberTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  PACKUNG: "PACKUNG",
  STANGE: "STANGE",
} as const;

export const AreaAreaTypeEnum = {
  UNDEFINED: "UNDEFINED",
  ZONE: "ZONE",
  MULTIDEPTH: "MULTIDEPTH",
  CAPACITY: "CAPACITY",
  INVENTORY_AREA: "INVENTORY_AREA",
} as const;

export const AreaLowStockInventoryEnum = {
  LOW_STOCK_CHECK_DISABLED: "LOW_STOCK_CHECK_DISABLED",
  LOW_STOCK_CHECK_ENABLED: "LOW_STOCK_CHECK_ENABLED",
} as const;

export const WmsUpdateBehaviour = {
  CALCULATE_DERIVED: "CALCULATE_DERIVED",
  DO_NOT_CALCULATE_DERIVED: "DO_NOT_CALCULATE_DERIVED",
} as const;

export const LengthUnit = {
  ...LengthUnits,
  Undefined: "Undefined",
} as const;

export const MassUnit = {
  ...MassUnits,
  Undefined: "Undefined",
} as const;

export const VolumeUnit = {
  ...VolumeUnits,
  Undefined: "Undefined",
} as const;

export const EntityTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  HU: "HU",
  Stock: "Stock",
  Bin: "Bin",
  Ressource: "Ressource",
  SerialNumber: "SerialNumber",
  HuStock: "HuStock",
} as const;

export const HuAndStockOnSameLevelEnum = {
  NO_CHECK: "NO_CHECK",
  NOT_ALLOWED: "NOT_ALLOWED",
};
export const WmsProcessTypeClassificationEnum = {
  STOCK_IN: "STOCK_IN",
  STOCK_MOVEMENT: "STOCK_MOVEMENT",
  STOCK_OUT: "STOCK_OUT",
} as const;

export const StockDocumentReferenceEnum = {
  DO_NOT_CHANGE_OUTBOUND_DELIVERY_REFERENCE:
    "DO_NOT_CHANGE_OUTBOUND_DELIVERY_REFERENCE",
  LINK_WITH_OUTBOUND_DELIVERY: "LINK_WITH_OUTBOUND_DELIVERY",
  UNLINK_FROM_OUTBOUND_DELIVERY: "UNLINK_FROM_OUTBOUND_DELIVERY",
} as const;

export const InventoryManagementRelevanceEnum = {
  NO_INVENTORY_MANAGEMENT: "NO_INVENTORY_MANAGEMENT",
  INVENTORY_MANAGEMENT_RELEVANT: "INVENTORY_MANAGEMENT_RELEVANT",
} as const;

export const ConfirmationEnum = {
  DO_NOT_CONFIRM_IMMEDIATELY: "DO_NOT_CONFIRM_IMMEDIATELY",
  CONFIRM_IMMEDIATELY: "CONFIRM_IMMEDIATELY",
} as const;

export const IntermediateBinDeterminationEnum = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
} as const;

export const PickingOrderCreationEnum = {
  DEFAULT: "DEFAULT",
  MOVE_WHOLE_HU: "MOVE_WHOLE_HU",
  BASKET_PICKING: "BASKET_PICKING",
  TWO_STEP_PICKING: "TWO_STEP_PICKING",
} as const;

export const HuWithdrawalEnum = {
  WITHDRAW_HU_IF_FULL_QTY_REQUESTED: "WITHDRAW_HU_IF_FULL_QTY_REQUESTED",
  NEVER_WITHDRAW_HU: "NEVER_WITHDRAW_HU",
} as const;

export const ReplenishmentHuWithdrawalEnum = {
  WITHDRAW_QUANTITIES: "WITHDRAW_QUANTITIES",
  WITHDRAW_HANDLING_UNIT: "WITHDRAW_HANDLING_UNIT",
} as const;

export const HuStockSelectionEnum = {
  DEFAULT: "DEFAULT",
  WHOLE_STOCK_AMOUNT: "WHOLE_STOCK_AMOUNT",
  WHOLE_HU: "WHOLE_HU",
} as const;

export const ProcessTypeStockOutEnum = {
  IMMEDIATELY: "IMMEDIATELY",
  DELAYED: "DELAYED",
} as const;

export const CapacityChecksDuringStockIn = {
  CAPACITY_CHECK_NOT_ACTIVATED: "CAPACITY_CHECK_NOT_ACTIVATED",
  CAPACITY_CHECK_ACTIVATED: "CAPACITY_CHECK_ACTIVATED",
} as const;

export const AutomaticHuNumberGenerationEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  SSCC: "SSCC",
  NUMBER_RANGE: "NUMBER_RANGE",
  NUMBER_RANGE_AND_SSCC_AS_VERIFICATION:
    "NUMBER_RANGE_AND_SSCC_AS_VERIFICATION",
} as const;

export const BehaviourIfEmptyDuringAddTasksStockOutEnum = {
  DELETE: "DELETE",
  ASSIGN_TO_DELIVERY: "ASSIGN_TO_DELIVERY",
} as const;

export const CmsGoodsIssueBehaviorEnum = {
  MANUAL: "MANUAL",
  CONFIRM_AUTOMATICALLY: "CONFIRM_AUTOMATICALLY",
} as const;

export const CmsGoodsReceiptBehaviorEnum = {
  MANUAL: "MANUAL",
  CONFIRM_AUTOMATICALLY: "CONFIRM_AUTOMATICALLY",
} as const;

export const ContainerManagementRelevancyEnum = {
  NOT_RELEVANT: "NOT_RELEVANT",
  RELEVANT_AND_SERIALIZED: "RELEVANT_AND_SERIALIZED",
  RELEVANT_AND_UNSERIALIZED: "RELEVANT_AND_UNSERIALIZED",
} as const;

export const StackableEnum = {
  NOT_STACKABLE: "NOT_STACKABLE",
  STACKABLE: "STACKABLE",
};

export const FoldableEnum = {
  NOT_FOLDABLE: "NOT_FOLDABLE",
  FOLDABLE: "FOLDABLE",
} as const;

export const OpeningStatusEnum = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};
export const DockStatusEnum = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};
export const SerialNumberRequiredEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  NO_SERIAL_NUMBERS: "NO_SERIAL_NUMBERS",
  SERIAL_NUMBERS: "SERIAL_NUMBERS",
};
export const BatchRequiredEnum = {
  BATCH_NOT_REQUIRED: "BATCH_NOT_REQUIRED",
  BATCH_REQUIRED: "BATCH_REQUIRED",
};

export const AccountType = {
  CONTAINER_ACCOUNT: "CONTAINER_ACCOUNT",
  TRANSFER_ACCOUNT: "TRANSFER_ACCOUNT",
};

export const BusinessPartnerRoleEnum = {
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
  SUPPLIER: "SUPPLIER",
  TECHNICIAN: "TECHNICIAN",
};

export const BusinessPartnerReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  UNIT_LEVEL_SERIALIZATION: "UNIT_LEVEL_SERIALIZATION",
  PRINT_CUSTOMER_MATERIAL_LABEL: "PRINT_CUSTOMER_MATERIAL_LABEL",
  CARRIER_ADVICE: "CARRIER_ADVICE",
  LIFTING_RAMP_REQUIRED: "LIFTING_RAMP_REQUIRED",
  CUSTOMER_HU_LABEL: "CUSTOMER_HU_LABEL",
  MAX_HU_ALLOWED_MONDAY: "MAX_HU_ALLOWED_MONDAY",
  MAX_HU_ALLOWED_TUESDAY: "MAX_HU_ALLOWED_TUESDAY",
  MAX_HU_ALLOWED_WEDNESDAY: "MAX_HU_ALLOWED_WEDNESDAY",
  MAX_HU_ALLOWED_THURSDAY: "MAX_HU_ALLOWED_THURSDAY",
  MAX_HU_ALLOWED_FRIDAY: "MAX_HU_ALLOWED_FRIDAY",
  MAX_HU_ALLOWED_SATURDAY: "MAX_HU_ALLOWED_SATURDAY",
  MAX_HU_ALLOWED_SUNDAY: "MAX_HU_ALLOWED_SUNDAY",
};

export const VerificationOptionsEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  QR: "QR",
  NFC: "NFC",
  CHECKDIGIT: "CHECKDIGIT",
  RANDOM_SELECT: "RANDOM_SELECT",
  SWIPE: "SWIPE",
  PATTERN: "PATTERN",
  COLOR: "COLOR",
  SYMBOLS: "SYMBOLS",
  GTIN: "GTIN",
  RFID: "RFID",
  PBL: "PBL",
  E: "E",
  VEKP_VENUM: "VEKP_VENUM",
  VEND_MAT: "VEND_MAT",
  EAN: "EAN",
  MATERIAL_EXTERNAL: "MATERIAL_EXTERNAL",
  MATERIAL_LONG: "MATERIAL_LONG",
  PRICE_NET: "PRICE_NET",
  PRICE_GROSS: "PRICE_GROSS",
  CUSTOMS_VALUE: "CUSTOMS_VALUE",
  DISPLAY: "DISPLAY",
  SMART_LABEL_ID: "SMART_LABEL_ID",
  PART_NUMBER: "PART_NUMBER",
  LABEL_NUMBER: "LABEL_NUMBER",
  PICKING_TYPE: "PICKING_TYPE",
  SCAN_REG_EXP: "SCAN_REG_EXP",
  SHIPCLOUD_ID: "SHIPCLOUD_ID",
  SHIPCLOUD_CARRIER_TRACKING_NO: "SHIPCLOUD_CARRIER_TRACKING_NO",
  SHIPCLOUD_TRACKING_URL: "SHIPCLOUD_TRACKING_URL",
  SHIPCLOUD_LABEL_URL: "SHIPCLOUD_LABEL_URL",
  SHIPCLOUD_PRICE: "SHIPCLOUD_PRICE",
  GOODS_RECEIPT_DATE: "GOODS_RECEIPT_DATE",
  TEST: "TEST",
  ALLOWEDLOAD: "ALLOWEDLOAD",
  CHECK_NUMBER: "CHECK_NUMBER",
  CONTENT: "CONTENT",
  DISTANCE: "DISTANCE",
  DRIVTIMEUN: "DRIVTIMEUN",
  HDL_UNIT_GRP1: "HDL_UNIT_GRP1",
  HDL_UNIT_GRP2: "HDL_UNIT_GRP2",
  HDL_UNIT_GRP3: "HDL_UNIT_GRP3",
  HDL_UNIT_GRP4: "HDL_UNIT_GRP4",
  HDL_UNIT_GRP5: "HDL_UNIT_GRP5",
  LABELTYPE: "LABELTYPE",
  LGTH_LOAD: "LGTH_LOAD",
  LOAD_LGT_UNIT: "LOAD_LGT_UNIT",
  LOG_POSITION: "LOG_POSITION",
  LOG_SYSTEM: "LOG_SYSTEM",
  MAT_GRP_SM: "MAT_GRP_SM",
  PACKNR_CONV: "PACKNR_CONV",
  PACKSTATUS_LOCAL: "PACKSTATUS_LOCAL",
  SH_MAT_TYP: "SH_MAT_TYP",
  SHIP_MAT: "SHIP_MAT",
  SHIP_MAT_EXTERNAL: "SHIP_MAT_EXTERNAL",
  SHIP_MAT_GUID: "SHIP_MAT_GUID",
  SHIP_MAT_LONG: "SHIP_MAT_LONG",
  SHIP_MAT_VERSION: "SHIP_MAT_VERSION",
  SORT_FLD: "SORT_FLD",
  TRAVL_TIME: "TRAVL_TIME",
  UNIT_OF_DIST: "UNIT_OF_DIST",
  DEFAULT: "DEFAULT",
  TOTALHUNUMBERS: "TOTALHUNUMBERS",
  CURRENTHUNUMBER: "CURRENTHUNUMBER",
  LatestTelemetryTimeStampUtc: "LatestTelemetryTimeStampUtc",
  LatestTelemetryControlPointName: "LatestTelemetryControlPointName",
  LatestTelemetryMfsError: "LatestTelemetryMfsError",
  LatestTelemetryDest: "LatestTelemetryDest",
  PRINTEDAT: "PRINTEDAT",
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
  SSCC: "SSCC",
  HU_LABEL_PRINTED: "HU_LABEL_PRINTED",
  MODEL_NUMBER: "MODEL_NUMBER",
  KIT: "KIT",
  STAGING_BIN: "STAGING_BIN",
  SENDIT_CARRIER_TRACKING_NO: "SENDIT_CARRIER_TRACKING_NO",
  SENDIT_PACKAGE_ID: "SENDIT_PACKAGE_ID",
  SENDIT_LABEL_URL: "SENDIT_LABEL_URL",
  SENDIT_SHIPMENT_ID: "SENDIT_SHIPMENT_ID",
  CONTAINER_NO: "CONTAINER_NO",
  CARRIER: "CARRIER",
  CARRIER_TRACKING_NO: "CARRIER_TRACKING_NO",
  DIAMETER: "DIAMETER",
  PALLET_PLACES_ON_GROUND_LEVEL: "PALLET_PLACES_ON_GROUND_LEVEL",
  SHIPPING_LABEL_URL: "SHIPPING_LABEL_URL",
  OLD_MATERIAL_NUMBER: "OLD_MATERIAL_NUMBER",
  LOADING_EQUIPMENT: "LOADING_EQUIPMENT",
  CARRIER_REFERENCE_1: "CARRIER_REFERENCE_1",
  CARRIER_REFERENCE_2: "CARRIER_REFERENCE_2",
  EXT_SHIPMENT_ID: "EXT_SHIPMENT_ID",
};

export const SpecialStockEnum = {
  NO_SPECIAL_STOCK: "NO_SPECIAL_STOCK",
  INDIVIDUAL_CUSTOMER_STOCK: "INDIVIDUAL_CUSTOMER_STOCK",
  CONSIGNMENT_STOCK: "CONSIGNMENT_STOCK",
  RETURNABLE_TRANSPORT_PACKAGING_VENDOR:
    "RETURNABLE_TRANSPORT_PACKAGING_VENDOR",
  PROJECT_STOCK: "PROJECT_STOCK",
} as const;

type Days = {
  [key: string]: any;
};

export const DayEnum: Days = {
  0: "MONDAY",
  1: "TUESDAY",
  2: "WEDNESDAY",
  3: "THURSDAY",
  4: "FRIDAY",
  5: "SATURDAY",
  6: "SUNDAY",
} as const;

export const MenuItemTypeEnum = {
  MVC: "MVC",
  REACT: "REACT",
  EXTERNAL_LINK: "EXTERNAL_LINK",
};

export const DifferenceStatusEnum = {
  CALCULATED: "CALCULATED",
  SETTLE_DIFFERENCE_IN_REMOTE_SYSTEM: "SETTLE_DIFFERENCE_IN_REMOTE_SYSTEM",
  DISCARDED: "DISCARDED",
  SETTLE_DIFFERENCE_LOCALLY: "SETTLE_DIFFERENCE_LOCALLY",
  AUTOMATICALLY_SETTLED_DIFFERENCE_IN_REMOTE_SYSTEM:
    "AUTOMATICALLY_SETTLED_DIFFERENCE_IN_REMOTE_SYSTEM",
  AUTOMATICALLY_SETTLED_DIFFERENCE_LOCALLY:
    "AUTOMATICALLY_SETTLED_DIFFERENCE_LOCALLY",
  MANUALLY_SETTLED_DIFFERENCE_IN_REMOTE_SYSTEM:
    "MANUALLY_SETTLED_DIFFERENCE_IN_REMOTE_SYSTEM",
  MANUALLY_SETTLED_DIFFERENCE_LOCALLY: "MANUALLY_SETTLED_DIFFERENCE_LOCALLY",
  ERROR_DURING_EXECUTION: "ERROR_DURING_EXECUTION",
};

export const StockComparisonOriginEnum = {
  LOCAL: "LOCAL",
  REMOTE: "REMOTE",
};

export const CalculationTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  MANUAL: "MANUAL",
  JOB: "JOB",
};

export const UploadActionEnum = {
  CREATED: "CREATED",
  UPDATED: "UPDATED",
};

// #region WMS (bin / handling unit / stock)
export const OrderTaskSrcHuSwitchBehaviourEnum = {
  NOT_ALLOWED: "NOT_ALLOWED",
  ALLOWED: "ALLOWED",
} as const;

export const HandlingIncomingHuEnum = {
  DO_NOT_DELETE_INCOMING_HU: "DO_NOT_DELETE_INCOMING_HU",
  DELETE_INCOMING_HU: "DELETE_INCOMING_HU",
} as const;
// #endregion

export const RemovalCreationBanEnum = {
  REMOVALS_ALLOWED: "REMOVALS_ALLOWED",
  REMOVAL_CONFIRMATIONS_ALLOWED_ONLY: "REMOVAL_CONFIRMATIONS_ALLOWED_ONLY",
};

export const HuStateEnum = {
  HU_IS_INITIAL: "HU_IS_INITIAL",
  HU_EVER_HAD: "HU_EVER_HAD",
};

export const WMSHuReferenceReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DEFAULT: "DEFAULT",
  TEST: "TEST",
  ALLOWEDLOAD: "ALLOWEDLOAD",
  CHECK_NUMBER: "CHECK_NUMBER",
  CONTENT: "CONTENT",
  DISTANCE: "DISTANCE",
  DRIVTIMEUN: "DRIVTIMEUN",
  HDL_UNIT_GRP1: "HDL_UNIT_GRP1",
  HDL_UNIT_GRP2: "HDL_UNIT_GRP2",
  HDL_UNIT_GRP3: "HDL_UNIT_GRP3",
  HDL_UNIT_GRP4: "HDL_UNIT_GRP4",
  HDL_UNIT_GRP5: "HDL_UNIT_GRP5",
  LABELTYPE: "LABELTYPE",
  LGTH_LOAD: "LGTH_LOAD",
  LOAD_LGT_UNIT: "LOAD_LGT_UNIT",
  LOG_POSITION: "LOG_POSITION",
  LOG_SYSTEM: "LOG_SYSTEM",
  MAT_GRP_SM: "MAT_GRP_SM",
  PACKNR_CONV: "PACKNR_CONV",
  PACKSTATUS_LOCAL: "PACKSTATUS_LOCAL",
  SH_MAT_TYP: "SH_MAT_TYP",
  SHIP_MAT: "SHIP_MAT",
  SHIP_MAT_EXTERNAL: "SHIP_MAT_EXTERNAL",
  SHIP_MAT_GUID: "SHIP_MAT_GUID",
  SHIP_MAT_LONG: "SHIP_MAT_LONG",
  SHIP_MAT_VERSION: "SHIP_MAT_VERSION",
  SORT_FLD: "SORT_FLD",
  TRAVL_TIME: "TRAVL_TIME",
  UNIT_OF_DIST: "UNIT_OF_DIST",
};

export const PackagingTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  CLOSED: "CLOSED",
};

export const HuDeleteEnum = {
  DELETE_HU: "DELETE_HU",
  DO_NOT_DELETE_HU: "DO_NOT_DELETE_HU",
};

export const ScanModeEnum = {
  NO_SCAN_OUTBOUND: "NO_SCAN_OUTBOUND",
  SCAN_MATERIAL_SINGLE_UNIT_PICK: "SCAN_MATERIAL_SINGLE_UNIT_PICK",
  SCAN_HU: "SCAN_HU",
  SCAN_FULL_HU_OUTBOUND: "SCAN_FULL_HU_OUTBOUND",
  SCAN_HU_WITH_SEVERAL_OUTBOUND_DELIVERIES:
    "SCAN_HU_WITH_SEVERAL_OUTBOUND_DELIVERIES",
  SCAN_HU_FOR_CUSTOMER: "SCAN_HU_FOR_CUSTOMER",
};

export const GroupedOutboundDeliveriesEnum = {
  NOT_ALLOWED: "NOT_ALLOWED",
  ALLOWED: "ALLOWED",
};

export const OutboundDeliveryItemsEnum = {
  SHOW_ALL: "SHOW_ALL",
  SHOW_ONLY_PICKED: "SHOW_ONLY_PICKED",
};

export const OutboundPackingScanningActivatedEnum = {
  DEACTIVATED_ON_PAGE_LOAD: "DEACTIVATED_ON_PAGE_LOAD",
  ACTIVATED__ON_PAGE_LOAD: "ACTIVATED__ON_PAGE_LOAD",
  LAST_STATUS_ON_PAGE_LOAD: "LAST_STATUS_ON_PAGE_LOAD",
};

export const ScanModePackingEnum = {
  NO_SCAN_PACKING: "NO_SCAN_PACKING",
  SCAN_SOURCE_HU_AND_MATERIAL: "SCAN_SOURCE_HU_AND_MATERIAL",
  SCAN_MATERIAL: "SCAN_MATERIAL",
  SCAN_FULL_HU_PACKING: "SCAN_FULL_HU_PACKING",
  PACK_ONE_STEP_SUPERMARKET: "PACK_ONE_STEP_SUPERMARKET",
  SCAN_BATCH: "SCAN_BATCH",
  SCAN_MULTIBATCH: "SCAN_MULTIBATCH",
};

export const DeviceEnum = {
  DEFAULT: "DEFAULT",
  CONTROLCENTER: "CONTROLCENTER",
  SMARTWATCH: "SMARTWATCH",
  SMARTPHONE: "SMARTPHONE",
  TABLET: "TABLET",
  DASHBUTTON: "DASHBUTTON",
  SCANNER: "SCANNER",
};

export const OutboundPackingAutoPrintHuLabelEnum = {
  NEVER: "NEVER",
  DELIVERY_COMPLETELY_PACKED: "DELIVERY_COMPLETELY_PACKED",
  ALL_DELIVERIES_COMPLETELY_PACKED: "ALL_DELIVERIES_COMPLETELY_PACKED",
};

export const ReferenceEnum = {
  LGNUM: "LGNUM",
  ZSYST: "ZSYST",
  VBELN: "VBELN",
  BWART: "BWART",
  CALLBACKURLCONFIRM: "CALLBACKURLCONFIRM",
  CALLBACKURLPRINT: "CALLBACKURLPRINT",
  QSYST: "QSYST",
  BWLVS: "BWLVS",
  LIKP_TDDAT: "LIKP_TDDAT",
  LIKP_WADAT: "LIKP_WADAT",
  LTAP_SONUM: "LTAP_SONUM",
  LIKP_WE_KUNNR: "LIKP_WE_KUNNR",
  LIKP_WE_LAND1: "LIKP_WE_LAND1",
  LIKP_WE_NAME1: "LIKP_WE_NAME1",
  LIKP_WE_NAME2: "LIKP_WE_NAME2",
  LIKP_WE_ORT01: "LIKP_WE_ORT01",
  LIKP_WE_PSTLZ: "LIKP_WE_PSTLZ",
  LIKP_WE_REGIO: "LIKP_WE_REGIO",
  LIKP_WE_STRAS: "LIKP_WE_STRAS",
  LIKP_WE_TELF1: "LIKP_WE_TELF1",
  LIKP_WE_ADRNR: "LIKP_WE_ADRNR",
  BARCODE1: "BARCODE1",
  BARCODE2: "BARCODE2",
  COUNTER: "COUNTER",
  SCAN_SWIPE: "SCAN_SWIPE",

  //Arvato SCM REFERENCES
  COMPARTMENT: "COMPARTMENT",
  EXPIRYDATE: "EXPIRYDATE",
  PICK_CART_TYPE: "PICK_CART_TYPE",
  BD_BARCODE: "BD_BARCODE",
  HU_TYPE: "HU_TYPE",
  ORDERTASK_ID: "ORDERTASK_ID",

  // Imperial REFERENCES
  ORDER_TYPE: "ORDER_TYPE",
  LABELUNTERNEHMER: "LABELUNTERNEHMER",
  EINLAGERER: "EINLAGERER",
  ETD: "ETD",
  ETA: "ETA",
  WARENEMPFAENGER: "WARENEMPFAENGER",
  LENGTH: "LENGTH",
  HEIGHT: "HEIGHT",
  WEIGHT: "WEIGHT",
  BATCH: "BATCH",
  AMOUNT_VOLPAL: "AMOUNT_VOLPAL",
  ICON: "ICON",
  NO_MATCHING_HU: "NO_MATCHING_HU",
  DANGERLABEL: "DANGERLABEL",
  HANGFIREJOBID: "HANGFIREJOBID",
  UNPRINTED_ORDERTASKS: "UNPRINTED_ORDERTASKS",
  ORDERNUMBER2: "ORDERNUMBER2",

  //Diebold Nixdorf References
  SAP_TA_DSTBIN: "SAP_TA_DSTBIN",
  SAP_TA_DSTBIN_PSA: "SAP_TA_DSTBIN_PSA",
  SAP_TANUM: "SAP_TANUM",

  //Diebold Nixdorf Refernces 2
  PICK_ORDER_NUMBER: "PICK_ORDER_NUMBER",
  PICK_ORDERTASK_NUMBER: "PICK_ORDERTASK_NUMBER",
  SAP_OT_NUMBER: "SAP_OT_NUMBER",

  //Daimler References
  DAIMLER_MAJOR_NUMBER: "DAIMLER_MAJOR_NUMBER",
  DAIMLER_MINOR_NUMBER: "DAIMLER_MINOR_NUMBER",
  DAIMLER_PNR: "DAIMLER_PNR",
  VERIFICATION_TEXT: "VERIFICATION_TEXT",
  DAIMLER_PICKING_TYPE: "DAIMLER_PICKING_TYPE",
  REMAINING_ITEM_COUNT: "REMAINING_ITEM_COUNT",
  TOTAL_ITEM_COUNT: "TOTAL_ITEM_COUNT",
  RECURRED_ORDERTASK: "RECURRED_ORDERTASK",
  DAIMLER_INTERFACE_HEADER_BPID: "DAIMLER_INTERFACE_HEADER_BPID",
  DAIMLER_INTERFACE_HEADER_BPNAME: "DAIMLER_INTERFACE_HEADER_BPNAME",
  DAIMLER_INTERFACE_HEADER_BOIDNAME: "DAIMLER_INTERFACE_HEADER_BOIDNAME",
  DAIMLER_INTERFACE_HEADER_BOIDVALUE: "DAIMLER_INTERFACE_HEADER_BOIDVALUE",
  DAIMLER_INTERFACE_HEADER_CALLINGAPP: "DAIMLER_INTERFACE_HEADER_CALLINGAPP",
  DAIMLER_INTERFACE_HEADER_INITIATOR: "DAIMLER_INTERFACE_HEADER_INITIATOR",
  DAIMLER_INTERFACE_VERSION_NUMBER: "DAIMLER_INTERFACE_VERSION_NUMBER",
  DAIMLER_INTERFACE_SINGLE_PICK: "DAIMLER_INTERFACE_SINGLE_PICK",
  DAIMLER_INTERFACE_SEQ_NAME: "DAIMLER_INTERFACE_SEQ_NAME",
  DAIMLER_INTERFACE_PICK_AREA_NAME: "DAIMLER_INTERFACE_PICK_AREA_NAME",
  DAIMLER_INTERFACE_PICK_TEAM: "DAIMLER_INTERFACE_PICK_TEAM",
  DAIMLER_PROD_NUMBER: "DAIMLER_PROD_NUMBER",
  DAIMLER_SEQ_NUMBER: "DAIMLER_SEQ_NUMBER",
  DAIMLER_SNR_DRUCK: "DAIMLER_SNR_DRUCK",
  DAIMLER_PROD_NAME_LONG: "DAIMLER_PROD_NAME_LONG",
  DAIMLER_PACKING_ORDER: "DAIMLER_PACKING_ORDER",
  DAIMLER_COMPARTMENT_INFO: "DAIMLER_COMPARTMENT_INFO",
  DAIMLER_SORT_ORDER: "DAIMLER_SORT_ORDER",
  DAIMLER_TAKT_NAME: "DAIMLER_TAKT_NAME",
  DAIMLER_MINOR_NUM_NUMBER: "DAIMLER_MINOR_NUM_NUMBER",
  DAIMLER_SNR: "DAIMLER_SNR",
  DAIMLER_ES1: "DAIMLER_ES1",
  DAIMLER_ES2: "DAIMLER_ES2",
  DAIMLER_INTERFACE_HEADER_TIMEOUT: "DAIMLER_INTERFACE_HEADER_TIMEOUT",
  DAIMLER_INTERFACE_HEADER_TRANSACTIONID:
    "DAIMLER_INTERFACE_HEADER_TRANSACTIONID",
  DAIMLER_ALTERNATIVE_PART: "DAIMLER_ALTERNATIVE_PART",
  DAIMLER_PRIMARY_PART: "DAIMLER_PRIMARY_PART",
  DAIMLER_INTERFACE_PICKLIST_NAME: "DAIMLER_INTERFACE_PICKLIST_NAME",

  //Diebold References 3
  ERROR_MESSAGE: "ERROR_MESSAGE",
  DERIVED_SRCBIN: "DERIVED_SRCBIN",
  DERIVED_DSTBIN: "DERIVED_DSTBIN",
  PROD_ORDER_NUMBER: "PROD_ORDER_NUMBER",
  SMART_LABEL_ID: "SMART_LABEL_ID",

  //SAP Subcontracting
  LGORT: "LGORT",
  EDATU: "EDATU",
  HANDOVERDATE: "HANDOVERDATE",
  DELDATE: "DELDATE",

  //Arvato SCM REFERENCES again
  SYST_MANDT: "SYST_MANDT",
  TASK_SHIFTED: "TASK_SHIFTED",
  LTAK_TANUM: "LTAK_TANUM",
  SERIES: "SERIES",
  LIKP_VSTEL: "LIKP_VSTEL",

  //Diebold References 4,
  INSPECTIONLOT: "INSPECTIONLOT",
  CUSTOMERSTATUS: "CUSTOMERSTATUS",

  //Check up
  CONVEYOR_OVERFLOW: "CONVEYOR_OVERFLOW",
  LOCK_REASON: "LOCK_REASON",
  EXTERNAL_ID: "EXTERNAL_ID",
  PREDECESSOR_HANDLING_UNIT: "PREDECESSOR_HANDLING_UNIT",
  PREDECESSOR_BIN: "PREDECESSOR_BIN",
  PREDECESSOR_NOTE: "PREDECESSOR_NOTE",
  PREDECESSOR_STATUS: "PREDECESSOR_STATUS",
  DESCRIPTION: "DESCRIPTION",
  ADDITIONAL_CONFIRMATION: "ADDITIONAL_CONFIRMATION",

  //Hormann
  CUSTOMERSTATUS_ALLOWED_VALUE: "CUSTOMERSTATUS_ALLOWED_VALUE",
  CUSTOMERSTATUS_DEFAULT_VALUE: "CUSTOMERSTATUS_DEFAULT_VALUE",
  UNIT_LEVEL_SERIALIZATION_HU_TYPE: "UNIT_LEVEL_SERIALIZATION_HU_TYPE",
  SERIALIZATION_SUB_HU_NUMBER: "SERIALIZATION_SUB_HU_NUMBER",
  CUSTOMER: "CUSTOMER",
  BATCH_DEVIATION: "BATCH_DEVIATION",
  TARGET_BATCH: "TARGET_BATCH",
  PICKING_LINK: "PICKING_LINK",
  PUTAWAY_BIN: "PUTAWAY_BIN",
  SRC_BIN_AREA: "SRC_BIN_AREA",
  DST_BIN_AREA: "DST_BIN_AREA",
  WORK_ORDER_NUMBER: "WORK_ORDER_NUMBER",
  GOODS_ISSUE_POSTED: "GOODS_ISSUE_POSTED",
  ASSEMBLY: "ASSEMBLY",
  SERIES_TYPE: "SERIES_TYPE",
  VERIFICATION: "VERIFICATION",
  REBOOKING_DOCUMENT_ID: "REBOOKING_DOCUMENT_ID",
  LIPS_EAN11: "LIPS_EAN11",
  LIPS_ARKTX: "LIPS_ARKTX",
  DAIMLER_MISSING_PARTS_REASON: "DAIMLER_MISSING_PARTS_REASON",
  REGULATORY_CASE: "REGULATORY_CASE",
  WANNEN_ID: "WANNEN_ID",
};

export const AssignmentState = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const ActivityOptions = {
  TWO_LINES: "TWO_LINES",
  THREE_LINES: "THREE_LINES",
  FOUR_LINES: "FOUR_LINES",
  TEXT: "TEXT",
  PICTURE: "PICTURE",
  GSE: "GSE",
  INDIVIDUAL: "INDIVIDUAL",
  CHECKDIGIT: "CHECKDIGIT",
  COLOR: "COLOR",
  SYMBOLS: "SYMBOLS",
  RANDOM_SELECT: "RANDOM_SELECT",
  QR: "QR",
  SWIPE: "SWIPE",
  PATTERN: "PATTERN",
  PICK_PROCESS: "PICK_PROCESS",
  NFC: "NFC",
  SCAN_HID: "SCAN_HID",
  SCAN_CAMERA: "SCAN_CAMERA",
  GTIN: "GTIN",
  RFID: "RFID",
  SHOW_MATERIAL_GROUPS: "SHOW_MATERIAL_GROUPS",
  PBL: "PBL",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type VolumeUnit = typeof VolumeUnit[keyof typeof VolumeUnit];
export type MassUnit = typeof MassUnit[keyof typeof MassUnit];
export type LengthUnit = typeof LengthUnit[keyof typeof LengthUnit];
export type WmsUpdateBehaviour =
  typeof WmsUpdateBehaviour[keyof typeof WmsUpdateBehaviour];
export type EntityTypeEnum = typeof EntityTypeEnum[keyof typeof EntityTypeEnum];
export type StockUsageEnum = typeof StockUsageEnum[keyof typeof StockUsageEnum];
export type MonthEnum = typeof MonthEnum[keyof typeof MonthEnum];
export type SerialNumberTypeEnum =
  typeof SerialNumberTypeEnum[keyof typeof SerialNumberTypeEnum];
export type AreaAreaTypeEnum =
  typeof AreaAreaTypeEnum[keyof typeof AreaAreaTypeEnum];
export type AreaLowStockInventoryEnum =
  typeof AreaLowStockInventoryEnum[keyof typeof AreaLowStockInventoryEnum];
export type HuAndStockOnSameLevelEnum =
  typeof HuAndStockOnSameLevelEnum[keyof typeof HuAndStockOnSameLevelEnum];
export type WmsProcessTypeClassificationEnum =
  typeof WmsProcessTypeClassificationEnum[keyof typeof WmsProcessTypeClassificationEnum];
export type StockDocumentReferenceEnum =
  typeof StockDocumentReferenceEnum[keyof typeof StockDocumentReferenceEnum];
export type InventoryManagementRelevanceEnum =
  typeof InventoryManagementRelevanceEnum[keyof typeof InventoryManagementRelevanceEnum];
export type ConfirmationEnum =
  typeof ConfirmationEnum[keyof typeof ConfirmationEnum];
export type IntermediateBinDeterminationEnum =
  typeof IntermediateBinDeterminationEnum[keyof typeof IntermediateBinDeterminationEnum];
export type PickingOrderCreationEnum =
  typeof PickingOrderCreationEnum[keyof typeof PickingOrderCreationEnum];
export type HuWithdrawalEnum =
  typeof HuWithdrawalEnum[keyof typeof HuWithdrawalEnum];
export type ReplenishmentHuWithdrawalEnum =
  typeof ReplenishmentHuWithdrawalEnum[keyof typeof ReplenishmentHuWithdrawalEnum];
export type HuStockSelectionEnum =
  typeof HuStockSelectionEnum[keyof typeof HuStockSelectionEnum];
export type ProcessTypeStockOutEnum =
  typeof ProcessTypeStockOutEnum[keyof typeof ProcessTypeStockOutEnum];
export type CapacityChecksDuringStockIn =
  typeof CapacityChecksDuringStockIn[keyof typeof CapacityChecksDuringStockIn];
export type AutomaticHuNumberGenerationEnum =
  typeof AutomaticHuNumberGenerationEnum[keyof typeof AutomaticHuNumberGenerationEnum];
export type BehaviourIfEmptyDuringAddTasksStockOutEnum =
  typeof BehaviourIfEmptyDuringAddTasksStockOutEnum[keyof typeof BehaviourIfEmptyDuringAddTasksStockOutEnum];
export type ContainerManagementRelevancyEnum =
  typeof ContainerManagementRelevancyEnum[keyof typeof ContainerManagementRelevancyEnum];
export type OpeningStatusEnum =
  typeof OpeningStatusEnum[keyof typeof OpeningStatusEnum];
export type DockStatusEnum = typeof DockStatusEnum[keyof typeof DockStatusEnum];
export type SerialNumberRequiredEnum =
  typeof SerialNumberRequiredEnum[keyof typeof SerialNumberRequiredEnum];
export type BatchRequiredEnum =
  typeof BatchRequiredEnum[keyof typeof BatchRequiredEnum];
export type AccountType = typeof AccountType[keyof typeof AccountType];
export type BusinessPartnerRoleEnum =
  typeof BusinessPartnerRoleEnum[keyof typeof BusinessPartnerRoleEnum];
export type BusinessPartnerReferenceTypeEnum =
  typeof BusinessPartnerReferenceTypeEnum[keyof typeof BusinessPartnerReferenceTypeEnum];
export type DayEnum = typeof DayEnum[keyof typeof DayEnum];
export type CmsGoodsIssueBehaviorEnum =
  typeof CmsGoodsIssueBehaviorEnum[keyof typeof CmsGoodsIssueBehaviorEnum];
export type CmsGoodsReceiptBehaviorEnum =
  typeof CmsGoodsReceiptBehaviorEnum[keyof typeof CmsGoodsReceiptBehaviorEnum];
export type VerificationOptionsEnum =
  typeof VerificationOptionsEnum[keyof typeof VerificationOptionsEnum];
export type SpecialStockEnum =
  typeof SpecialStockEnum[keyof typeof SpecialStockEnum];
export type StockCategoryEnum =
  typeof StockCategoryEnum[keyof typeof StockCategoryEnum];
export type MenuItemTypeEnum =
  typeof MenuItemTypeEnum[keyof typeof MenuItemTypeEnum];
export type DifferenceStatusEnum =
  typeof DifferenceStatusEnum[keyof typeof DifferenceStatusEnum];
export type StockComparisonOriginEnum =
  typeof StockComparisonOriginEnum[keyof typeof StockComparisonOriginEnum];
export type CalculationTypeEnum =
  typeof CalculationTypeEnum[keyof typeof CalculationTypeEnum];

// #region WMS (bin / handling unit / stock)
export type OrderTaskSrcHuSwitchBehaviourEnum =
  typeof OrderTaskSrcHuSwitchBehaviourEnum[keyof typeof OrderTaskSrcHuSwitchBehaviourEnum];
export type HandlingIncomingHuEnum =
  typeof HandlingIncomingHuEnum[keyof typeof HandlingIncomingHuEnum];
// #endregion

export type RemovalCreationBanEnum =
  typeof RemovalCreationBanEnum[keyof typeof RemovalCreationBanEnum];
export type HuStateEnum = typeof HuStateEnum[keyof typeof HuStateEnum];
export type WMSHuReferenceReferenceTypeEnum =
  typeof WMSHuReferenceReferenceTypeEnum[keyof typeof WMSHuReferenceReferenceTypeEnum];
export type PackagingTypeEnum =
  typeof PackagingTypeEnum[keyof typeof PackagingTypeEnum];
export type HuDeleteEnum = typeof HuDeleteEnum[keyof typeof HuDeleteEnum];

export type ScanModeEnum = typeof ScanModeEnum[keyof typeof ScanModeEnum];
export type GroupedOutboundDeliveriesEnum =
  typeof GroupedOutboundDeliveriesEnum[keyof typeof GroupedOutboundDeliveriesEnum];
export type OutboundDeliveryItemsEnum =
  typeof OutboundDeliveryItemsEnum[keyof typeof OutboundDeliveryItemsEnum];
export type ScanModePackingEnum =
  typeof ScanModePackingEnum[keyof typeof ScanModePackingEnum];
export type OutboundPackingScanningActivatedEnum =
  typeof OutboundPackingScanningActivatedEnum[keyof typeof OutboundPackingScanningActivatedEnum];

export type DeviceEnum = typeof DeviceEnum[keyof typeof DeviceEnum];
export type ReferenceEnum = typeof ReferenceEnum[keyof typeof ReferenceEnum];
export type AssignmentState =
  typeof AssignmentState[keyof typeof AssignmentState];
export type ActivityOptions =
  typeof ActivityOptions[keyof typeof ActivityOptions];
export type StackableEnum = typeof StackableEnum[keyof typeof StackableEnum];
export type FoldableEnum = typeof FoldableEnum[keyof typeof FoldableEnum];
export type UploadActionEnum =
  typeof UploadActionEnum[keyof typeof UploadActionEnum];
export type OutboundPackingAutoPrintHuLabelEnum =
  typeof OutboundPackingAutoPrintHuLabelEnum[keyof typeof OutboundPackingAutoPrintHuLabelEnum];
/* eslint-enable */
