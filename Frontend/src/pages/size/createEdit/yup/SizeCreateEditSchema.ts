import * as yup from "yup";

export const SizeCreateEditSchema = yup.object({
  name: yup.string().required(),
});

export type YupSizeCreateEdit = yup.InferType<typeof SizeCreateEditSchema>;
