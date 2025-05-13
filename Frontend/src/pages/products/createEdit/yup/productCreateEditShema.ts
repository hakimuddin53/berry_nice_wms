import { guid } from "types/guid";
import * as yup from "yup";

export const productCreateEditShema = yup.object({
  name: yup.string().required(),
  itemCode: yup.string().required(),
  clientCodeId: yup.mixed<guid>().required(),
  quantityPerCarton: yup.number().nullable(),
  categoryId: yup.mixed<guid>().required(),
  sizeId: yup.mixed<guid>().required(),
  colourId: yup.mixed<guid>().required(),
  designId: yup.mixed<guid>().required(),
  cartonSizeId: yup.mixed<guid>().required(),
  productPhotoUrl: yup.string().nullable(),
  listPrice: yup.number().required(),
  threshold: yup.number().nullable(),
});

export type YupProductCreateEdit = yup.InferType<typeof productCreateEditShema>;
