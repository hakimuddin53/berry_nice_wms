import * as yup from "yup";

export const DesignCreateEditSchema = yup.object({
  name: yup.string().required(),
});

export type YupDesignCreateEdit = yup.InferType<typeof DesignCreateEditSchema>;
