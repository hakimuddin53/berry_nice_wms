export const PageOrientationEnum = {
  L: "L", //Landscape
  P: "P", //Portrait
} as const;

export const PageFormatEnum = {
  A3: "A3",
  A4: "A4",
  A5: "A5",
  A6: "A6",
};

export const PrintTemplateTypeEnum = {
  PDF: "PDF",
  ZPL: "ZPL",
};

/* eslint-disable @typescript-eslint/no-redeclare */
export type PageOrientationEnum =
  typeof PageOrientationEnum[keyof typeof PageOrientationEnum];
export type PageFormatEnum = typeof PageFormatEnum[keyof typeof PageFormatEnum];
export type PrintTemplateTypeEnum =
  typeof PrintTemplateTypeEnum[keyof typeof PrintTemplateTypeEnum];
/* eslint-enable */
