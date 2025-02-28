import * as yup from "yup";

export const LocationCreateEditSchema = yup.object({
  name: yup.string().required(),
});

export type YupLocationCreateEdit = yup.InferType<
  typeof LocationCreateEditSchema
>;
