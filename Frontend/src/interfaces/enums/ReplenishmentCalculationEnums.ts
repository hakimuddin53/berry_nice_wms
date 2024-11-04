export const ReplenishmentCalculationStatusEnum = {
  CALCULATION_STARTED: "CALCULATION_STARTED",
  CALCULATION_FINISHED: "CALCULATION_FINISHED",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type ReplenishmentCalculationStatusEnum =
  typeof ReplenishmentCalculationStatusEnum[keyof typeof ReplenishmentCalculationStatusEnum];
/* eslint-enable */
