import { DifferenceStatusEnum } from "./GlobalEnums";

export const StockComparisonStatusEnum = {
  CREATED: "CREATED",
  STOCKS: "STOCKS",
  COMPLETE: "COMPLETE",
  DIFFERENCES_CALCULATED: "DIFFERENCES_CALCULATED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const MaterialUnitsHandlingEnum = {
  USE_UNIT: "USE_UNIT",
  USE_BASE_UNIT: "USE_BASE_UNIT",
} as const;

export const StockComparisonTypeEnum = {
  REQUEST_REMOTE_STOCKS: "REQUEST_REMOTE_STOCKS",
  CALCULATE_LOCAL_STOCKS_ONLY: "CALCULATE_LOCAL_STOCKS_ONLY",
} as const;

export const ExecuteLocalStockCalculationEnum = {
  MANUALLY: "MANUALLY",
  AUTOMATICALLY_WHEN_STOCK_COMPARISON_CREATED:
    "AUTOMATICALLY_WHEN_STOCK_COMPARISON_CREATED",
} as const;

export const ExecuteDifferenceCalculationEnum = {
  MANUALLY: "MANUALLY",
  AUTOMATICALLY_WHEN_LOCAL_AND_REMOTE_STOCKS_CALCULATED:
    "AUTOMATICALLY_WHEN_LOCAL_AND_REMOTE_STOCKS_CALCULATED",
} as const;

export const DisallowedDifferencesStatus: DifferenceStatusEnum[] = [
  DifferenceStatusEnum.AUTOMATICALLY_SETTLED_DIFFERENCE_IN_REMOTE_SYSTEM,
  DifferenceStatusEnum.AUTOMATICALLY_SETTLED_DIFFERENCE_LOCALLY,
];

/* eslint-disable @typescript-eslint/no-redeclare */
export type StockComparisonStatusEnum =
  typeof StockComparisonStatusEnum[keyof typeof StockComparisonStatusEnum];
export type MaterialUnitsHandlingEnum =
  typeof MaterialUnitsHandlingEnum[keyof typeof MaterialUnitsHandlingEnum];
export type StockComparisonTypeEnum =
  typeof StockComparisonTypeEnum[keyof typeof StockComparisonTypeEnum];
export type ExecuteLocalStockCalculationEnum =
  typeof ExecuteLocalStockCalculationEnum[keyof typeof ExecuteLocalStockCalculationEnum];
export type ExecuteDifferenceCalculationEnum =
  typeof ExecuteDifferenceCalculationEnum[keyof typeof ExecuteDifferenceCalculationEnum];
export type DisallowedDifferencesStatus =
  typeof DisallowedDifferencesStatus[keyof typeof DifferenceStatusEnum[]];
/* eslint-enable */
