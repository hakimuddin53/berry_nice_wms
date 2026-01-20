import * as yup from "yup";

export const customerCreateEditSchema = yup.object({
  name: yup.string().required(),
  phone: yup.string().optional(),
  email: yup.string().email().optional(),
  address: yup.string().optional(),
  customerTypeId: yup.string().required(),
});

export type YupCustomerCreateEdit = yup.InferType<
  typeof customerCreateEditSchema
>;
