export const StockSeparatingCriteriaTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  STOCK_TYPE: "STOCK_TYPE",
  OWNER: "OWNER",
  BATCH: "BATCH",
  SPECIAL_STOCK: "SPECIAL_STOCK",
  SPECIAL_STOCK_NUMBER: "SPECIAL_STOCK_NUMBER",
  STOCK_USAGE: "STOCK_USAGE",
  HU_TYPE: "HU_TYPE",
};
/* eslint-disable @typescript-eslint/no-redeclare */
export type StockSeparatingCriteriaTypeEnum =
  typeof StockSeparatingCriteriaTypeEnum[keyof typeof StockSeparatingCriteriaTypeEnum];
/* eslint-enable */
