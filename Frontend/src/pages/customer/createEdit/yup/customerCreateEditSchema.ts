import { guid } from "types/guid";
import * as yup from "yup";

export const customerCreateEditSchema = yup.object({
  customerCode: yup.string().required(),
  name: yup.string().required(),
  phone: yup.string().optional(),
  email: yup.string().email().optional(),
  address: yup.string().optional(),
  customerType: yup.string().required(),
});

export type YupCustomerCreateEdit = yup.InferType<
  typeof customerCreateEditSchema
>;
