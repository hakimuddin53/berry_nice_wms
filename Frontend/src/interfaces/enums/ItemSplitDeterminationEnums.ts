export const ItemSplitDeterminationEntityEnum = {
  OUTBOUND_DELIVERY: "OUTBOUND_DELIVERY",
  OUTBOUND_DELIVERY_ITEM: "OUTBOUND_DELIVERY_ITEM",
};

export const ItemSplitDeterminationFieldEnum = {
  CARRIER: "CARRIER",
  DOCUMENT_TYPE: "DOCUMENT_TYPE",
  REFERENCES_VALUE: "REFERENCES_VALUE",
  REFERENCE_EXISTS: "REFERENCE_EXISTS",
  MATERIAL_GROUP: "MATERIAL_GROUP",
  UNIT: "UNIT",
  OPEN_PICKING_ITEMS: "OPEN_PICKING_ITEMS",
};

export const ItemSplitDeterminationEntityOutboundDeliveryFieldEnum = {
  CARRIER: "CARRIER",
  DOCUMENT_TYPE: "DOCUMENT_TYPE",
  REFERENCES_VALUE: "REFERENCES_VALUE",
  REFERENCE_EXISTS: "REFERENCE_EXISTS",
  OPEN_PICKING_ITEMS: "OPEN_PICKING_ITEMS",
};

export const ItemSplitDeterminationEntityOutboundDeliveryItemFieldEnum = {
  MATERIAL_GROUP: "MATERIAL_GROUP",
  UNIT: "UNIT",
};

export const ItemSplitDeterminationItemSplitEnum = {
  NO_SPLIT_CANCEL: "NO_SPLIT_CANCEL",
  REPLACE_ITEM: "REPLACE_ITEM",
  SPLIT_ITEM: "SPLIT_ITEM",
  CREATE_SUB_ITEMS: "CREATE_SUB_ITEMS",
};

export const ItemSplitDeterminationCompareReferenceMaterialUnitEnum = {
  QUANTITY_GREATER_OR_EQUAL_REFERENCE_MATERIAL_UNIT:
    "QUANTITY_GREATER_OR_EQUAL_REFERENCE_MATERIAL_UNIT",
  QUANTITY_WHOLE_MULTIPLE_REFERENCE_MATERIAL_UNIT:
    "QUANTITY_WHOLE_MULTIPLE_REFERENCE_MATERIAL_UNIT",
};

export const ItemSplitDeterminationConvertQuantityEnum = {
  DO_NOT_CONVERT_QUANTITY: "DO_NOT_CONVERT_QUANTITY",
  CONVERT_QUANTITY_REFERENCE_MATERIAL_UNIT:
    "CONVERT_QUANTITY_REFERENCE_MATERIAL_UNIT",
  CONVERT_QUANTITY_NEW_MATERIAL_UNIT_IF_DIVIDABLE:
    "CONVERT_QUANTITY_NEW_MATERIAL_UNIT_IF_DIVIDABLE",
  CONVERT_QUANTITY_ALWAYS_NEW_MATERIAL_UNIT:
    "CONVERT_QUANTITY_ALWAYS_NEW_MATERIAL_UNIT",
};

export const ItemSplitDeterminationQuantityToSplitEnum = {
  WHOLE_QUANTITY: "WHOLE_QUANTITY",
  WHOLE_MULTIPLE_REFERENCE_MATERIAL_UNIT:
    "WHOLE_MULTIPLE_REFERENCE_MATERIAL_UNIT",
};

/* eslint-disable @typescript-eslint/no-redeclare */
export type ItemSplitDeterminationEntityEnum =
  typeof ItemSplitDeterminationEntityEnum[keyof typeof ItemSplitDeterminationEntityEnum];
export type ItemSplitDeterminationFieldEnum =
  typeof ItemSplitDeterminationFieldEnum[keyof typeof ItemSplitDeterminationFieldEnum];
export type ItemSplitDeterminationEntityOutboundDeliveryFieldEnum =
  typeof ItemSplitDeterminationEntityOutboundDeliveryFieldEnum[keyof typeof ItemSplitDeterminationEntityOutboundDeliveryFieldEnum];
export type ItemSplitDeterminationEntityOutboundDeliveryItemFieldEnum =
  typeof ItemSplitDeterminationEntityOutboundDeliveryItemFieldEnum[keyof typeof ItemSplitDeterminationEntityOutboundDeliveryItemFieldEnum];
export type ItemSplitDeterminationItemSplitEnum =
  typeof ItemSplitDeterminationItemSplitEnum[keyof typeof ItemSplitDeterminationItemSplitEnum];
export type ItemSplitDeterminationCompareReferenceMaterialUnitEnum =
  typeof ItemSplitDeterminationCompareReferenceMaterialUnitEnum[keyof typeof ItemSplitDeterminationCompareReferenceMaterialUnitEnum];
export type ItemSplitDeterminationConvertQuantityEnum =
  typeof ItemSplitDeterminationConvertQuantityEnum[keyof typeof ItemSplitDeterminationConvertQuantityEnum];
export type ItemSplitDeterminationQuantityToSplitEnum =
  typeof ItemSplitDeterminationQuantityToSplitEnum[keyof typeof ItemSplitDeterminationQuantityToSplitEnum];
/* eslint-enable */
