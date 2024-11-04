export const CmsOrderRuleTypeEnum = {
  MANUAL: "MANUAL",
  ORDER_RHYTHM: "ORDER_RHYTHM",
  REORDER_POINT: "REORDER_POINT",
};

/* eslint-disable @typescript-eslint/no-redeclare */
export type CmsOrderRuleTypeEnum =
  typeof CmsOrderRuleTypeEnum[keyof typeof CmsOrderRuleTypeEnum];
/* eslint-enable */
