export const BehaviorInCaseRoleExistEnum = {
  CREATE: "CREATE",
  REPLACE: "REPLACE",
};

export const PartnerDeterminationMappingEntityEnum = {
  OUTBOUND_DELIVERY: "OUTBOUND_DELIVERY",
};

export const PartnerDeterminationMappingFieldEnum = {
  FIRST_ITEM_OWNER: "FIRST_ITEM_OWNER",
};

/* eslint-disable @typescript-eslint/no-redeclare */
export type BehaviorInCaseRoleExistEnum =
  typeof BehaviorInCaseRoleExistEnum[keyof typeof BehaviorInCaseRoleExistEnum];
export type PartnerDeterminationMappingFieldEnum =
  typeof PartnerDeterminationMappingFieldEnum[keyof typeof PartnerDeterminationMappingFieldEnum];
export type PartnerDeterminationMappingEntityEnum =
  typeof PartnerDeterminationMappingEntityEnum[keyof typeof PartnerDeterminationMappingEntityEnum];
/* eslint-enable */
