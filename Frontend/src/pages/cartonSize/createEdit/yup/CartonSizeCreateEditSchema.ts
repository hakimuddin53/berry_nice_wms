import * as yup from "yup";

export const CartonSizeCreateEditSchema = yup.object({
  name: yup.string().required(),
});

export type YupCartonSizeCreateEdit = yup.InferType<
  typeof CartonSizeCreateEditSchema
>;
