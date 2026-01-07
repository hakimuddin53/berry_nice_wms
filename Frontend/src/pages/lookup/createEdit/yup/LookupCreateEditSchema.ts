import * as yup from "yup";

export const LookupCreateEditSchema = yup.object({
  label: yup.string().required(),
  sortOrder: yup.number().integer().min(0).required(),
  isActive: yup.boolean().required(),
});

export type YupLookupCreateEdit = yup.InferType<typeof LookupCreateEditSchema>;
