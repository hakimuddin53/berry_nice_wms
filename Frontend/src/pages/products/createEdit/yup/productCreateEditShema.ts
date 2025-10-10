import { guid } from "types/guid";
import * as yup from "yup";

export const productCreateEditShema = yup.object({
  productCode: yup.string().required(),
  categoryId: yup.mixed<guid>().required(),
  brandId: yup.mixed<guid>().nullable(),
  model: yup.string().nullable(),
  colorId: yup.mixed<guid>().nullable(),
  storageId: yup.mixed<guid>().nullable(),
  ramId: yup.mixed<guid>().nullable(),
  processorId: yup.mixed<guid>().nullable(),
  screenSizeId: yup.mixed<guid>().nullable(),
  lowQty: yup.number().required(),
});

export type YupProductCreateEdit = yup.InferType<typeof productCreateEditShema>;
