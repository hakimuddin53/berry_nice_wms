import * as yup from "yup";

export const supplierCreateEditSchema = yup.object({
  name: yup.string().required(),
  ic: yup.string().optional(),
  taxId: yup.string().optional(),
  address1: yup.string().optional(),
  address2: yup.string().optional(),
  address3: yup.string().optional(),
  address4: yup.string().optional(),
  contactNo: yup.string().optional(),
  email: yup.string().email().optional(),
});

export type YupSupplierCreateEdit = yup.InferType<
  typeof supplierCreateEditSchema
>;
