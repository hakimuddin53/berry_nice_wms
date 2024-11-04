export const StockComparisonJobNotificationEnum = {
  SHOW_JOB_ONLY_TO_ME: "SHOW_JOB_ONLY_TO_ME",
  SHOW_JOB_TO_EVERYONE: "SHOW_JOB_TO_EVERYONE",
} as const;

export const StockComparisonJobOccuranceEnum = {
  SCHEDULE_ONCE: "SCHEDULE_ONCE",
  SCHEDULE_RECURRING: "SCHEDULE_RECURRING",
} as const;
export const StockComparisonJobActionEnum = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type StockComparisonJobNotificationEnum =
  typeof StockComparisonJobNotificationEnum[keyof typeof StockComparisonJobNotificationEnum];
export type StockComparisonJobOccuranceEnum =
  typeof StockComparisonJobOccuranceEnum[keyof typeof StockComparisonJobOccuranceEnum];
export type StockComparisonJobActionEnum =
  typeof StockComparisonJobActionEnum[keyof typeof StockComparisonJobActionEnum];
/* eslint-enable */
