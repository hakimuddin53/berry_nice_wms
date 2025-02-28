import * as yup from "yup";

export const ColourCreateEditSchema = yup.object({
  name: yup.string().required(),
});

export type YupColourCreateEdit = yup.InferType<typeof ColourCreateEditSchema>;
