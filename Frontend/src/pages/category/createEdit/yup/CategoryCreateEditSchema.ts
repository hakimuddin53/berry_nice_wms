import * as yup from "yup";

export const CategoryCreateEditSchema = yup.object({
  name: yup.string().required(),
});

export type YupCategoryCreateEdit = yup.InferType<
  typeof CategoryCreateEditSchema
>;
