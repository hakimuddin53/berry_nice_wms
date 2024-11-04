export const CacheObjectStatus = {
  SUCCESS: "SUCCESS",
  NOTFOUND: "NOTFOUND",
  PENDING: "PENDING",
  FETCHING: "FETCHING",
  ERROR: "ERROR",
};

export const CacheObjectStateMessage = {
  NOTFOUND: "NOTFOUND",
  LOADING: "LOADING",
  UNKNOWN: "UNKNOWN",
  ERROR: "ERROR",
};

/* eslint-disable @typescript-eslint/no-redeclare */
export type CacheObjectStatus =
  typeof CacheObjectStatus[keyof typeof CacheObjectStatus];
export type CacheObjectStateMessage =
  typeof CacheObjectStateMessage[keyof typeof CacheObjectStateMessage];
/* eslint-enable */
