export const DisplayType = {
  DATEONLY: "DATEONLY",
  TIMEONLY: "TIMEONLY",
  DATETIME: "DATETIME",
};

/* eslint-disable @typescript-eslint/no-redeclare */
export type DisplayType = typeof DisplayType[keyof typeof DisplayType];
