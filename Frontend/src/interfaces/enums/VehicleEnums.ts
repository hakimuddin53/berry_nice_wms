export const VehicleReferenceTypeEnum = {
  UNSPECIFIED: "UNSPECIFIED",
  RFID_CODE: "RFID_CODE",
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type VehicleReferenceTypeEnum =
  typeof VehicleReferenceTypeEnum[keyof typeof VehicleReferenceTypeEnum];
/* eslint-enable */
