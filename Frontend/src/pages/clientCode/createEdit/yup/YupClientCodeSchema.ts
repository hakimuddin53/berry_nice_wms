import * as yup from "yup";

export const ClientCodeCreateEditSchema = yup.object({
  name: yup.string().required(),
});

export type YupClientCodeCreateEdit = yup.InferType<
  typeof ClientCodeCreateEditSchema
>;
