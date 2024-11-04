export const EventCategoryEnum = {
  PROCESS_MONITORING: "PROCESS_MONITORING",
};

export const EventCategoryTypeEnum = {
  PROCESS_DURATION: "PROCESS_DURATION",
  PROCESS_TIME: "PROCESS_TIME",
  PROCESS_METRICS: "PROCESS_METRICS",
  PROCESS_ERROR: "PROCESS_ERROR",
  PROCESS_SUCCESS: "PROCESS_SUCCESS",
  PROCESS_INFO: "PROCESS_INFO",
};

export const EventStatusEnum = {
  OPEN: "OPEN",
  FINISHED: "FINISHED",
};

/* eslint-disable @typescript-eslint/no-redeclare */
export type EventCategoryEnum =
  typeof EventCategoryEnum[keyof typeof EventCategoryEnum];
export type EventCategoryTypeEnum =
  typeof EventCategoryTypeEnum[keyof typeof EventCategoryTypeEnum];
export type EventStatusEnum =
  typeof EventStatusEnum[keyof typeof EventStatusEnum];
/* eslint-enable */
