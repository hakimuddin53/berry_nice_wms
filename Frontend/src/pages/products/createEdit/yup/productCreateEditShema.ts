import { guid } from "types/guid";
import * as yup from "yup";

export const productCreateEditShema = yup.object({
  sku: yup.string().required(),
  categoryId: yup.mixed<guid>().required(),
  brandId: yup.mixed<guid>().nullable(),
  modelId: yup.mixed<guid>().nullable(),
  colorId: yup.mixed<guid>().nullable(),
  storageId: yup.mixed<guid>().nullable(),
  ramId: yup.mixed<guid>().nullable(),
  processorId: yup.mixed<guid>().nullable(),
  screenSizeId: yup.mixed<guid>().nullable(),
  hasSerial: yup.boolean().required(),
  retailPrice: yup.number().required(),
  dealerPrice: yup.number().required(),
  agentPrice: yup.number().required(),
  lowQty: yup.number().required(),
});

export type YupProductCreateEdit = yup.InferType<typeof productCreateEditShema>;
