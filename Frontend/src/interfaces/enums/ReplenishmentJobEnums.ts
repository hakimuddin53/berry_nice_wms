export const ReplenishmentJobCreateZeroDemandsEnum = {
  CREATE_ZERO_DEMANDS: "CREATE_ZERO_DEMANDS",
  CREATE_DEMANDS_WITH_QUANTITY_ONLY: "CREATE_DEMANDS_WITH_QUANTITY_ONLY",
} as const;

export const ReplenishmentJobConsiderReplenishmentRulesDestinationBinDeterminationEnum =
  {
    ALWAYS: "ALWAYS",
    IF_NO_BIN_SET_IN_REPLENISHMENT_RULES:
      "IF_NO_BIN_SET_IN_REPLENISHMENT_RULES",
  } as const;

export const ReplenishmentJobPlannedGIDateRelativeUnitEnum = {
  SECOND: "SECOND",
  MINUTE: "MINUTE",
  HOUR: "HOUR",
  DAY: "DAY",
  WEEK: "WEEK",
} as const;

export const ReplenishmentJobActionEnum = {
  INACTIVE: "INACTIVE",
  CALCULATE_DEMANDS_ONLY: "CALCULATE_DEMANDS_ONLY",
  CALCULATE_DEMANDS_AND_CREATE_TASKS: "CALCULATE_DEMANDS_AND_CREATE_TASKS",
} as const;

export const ReplenishmentJobNotificationEnum = {
  SHOW_JOB_ONLY_TO_ME: "SHOW_JOB_ONLY_TO_ME",
  SHOW_JOB_TO_EVERYONE: "SHOW_JOB_TO_EVERYONE",
} as const;

export const ReplenishmentJobOccuranceEnum = {
  SCHEDULE_ONCE: "SCHEDULE_ONCE",
  SCHEDULE_RECURRING: "SCHEDULE_RECURRING",
} as const;

export const ReplenishmentJobStringSortCriteriaEnum = {
  DESTINATION_BIN_PRIORITY: "DESTINATION_BIN_PRIORITY",
} as const;

export const ReplenishmentJobStringSortOrderEnum = {
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type ReplenishmentJobCreateZeroDemandsEnum =
  typeof ReplenishmentJobCreateZeroDemandsEnum[keyof typeof ReplenishmentJobCreateZeroDemandsEnum];
export type ReplenishmentJobConsiderReplenishmentRulesDestinationBinDeterminationEnum =
  typeof ReplenishmentJobConsiderReplenishmentRulesDestinationBinDeterminationEnum[keyof typeof ReplenishmentJobConsiderReplenishmentRulesDestinationBinDeterminationEnum];
export type ReplenishmentJobPlannedGIDateRelativeUnitEnum =
  typeof ReplenishmentJobPlannedGIDateRelativeUnitEnum[keyof typeof ReplenishmentJobPlannedGIDateRelativeUnitEnum];
export type ReplenishmentJobActionEnum =
  typeof ReplenishmentJobActionEnum[keyof typeof ReplenishmentJobActionEnum];
export type ReplenishmentJobNotificationEnum =
  typeof ReplenishmentJobNotificationEnum[keyof typeof ReplenishmentJobNotificationEnum];
export type ReplenishmentJobOccuranceEnum =
  typeof ReplenishmentJobOccuranceEnum[keyof typeof ReplenishmentJobOccuranceEnum];
export type ReplenishmentJobStringSortCriteriaEnum =
  typeof ReplenishmentJobStringSortCriteriaEnum[keyof typeof ReplenishmentJobStringSortCriteriaEnum];
export type ReplenishmentJobStringSortOrderEnum =
  typeof ReplenishmentJobStringSortOrderEnum[keyof typeof ReplenishmentJobStringSortOrderEnum];
/* eslint-enable */
