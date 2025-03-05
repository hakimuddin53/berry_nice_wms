import * as yup from "yup";

export const WarehouseCreateEditSchema = yup.object({
  name: yup.string().required(),
});

export type YupWarehouseCreateEdit = yup.InferType<
  typeof WarehouseCreateEditSchema
>;
