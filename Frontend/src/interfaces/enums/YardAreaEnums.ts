export const YardAreaTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  DOCK: "DOCK",
  WAITING_AREA: "WAITING_AREA",
  PARKING_AREA: "PARKING_AREA",
  PARKING_LOT: "PARKING_LOT",
  SCALES: "SCALES",
  ENTRANCE_BARRIER: "ENTRANCE_BARRIER",
  EXIT_BARRIER: "EXIT_BARRIER",
  CHECK_IN: "CHECK_IN",
  CHECK_OUT: "CHECK_OUT",
  SAMPLE_TAKING: "SAMPLE_TAKING",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type YardAreaTypeEnum =
  typeof YardAreaTypeEnum[keyof typeof YardAreaTypeEnum];
/* eslint-enable */
