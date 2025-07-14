import { guid } from "types/guid";
import * as yup from "yup";

export const StockInCreateEditSchema = yup.object({
  number: yup.string().nullable(),
  poNumber: yup.string().required(),
  fromLocation: yup.string().required(),
  warehouseId: yup.mixed<guid>().required(),
  stockInItems: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string(),
        productId: yup.mixed<guid>().required(),
        locationId: yup.mixed<guid>().required(),
        quantity: yup.number().required(),
      })
    )
    .required(),
});

export type YupStockInCreateEdit = yup.InferType<
  typeof StockInCreateEditSchema
>;
export type YupStockInItemsCreateEdit = YupStockInCreateEdit["stockInItems"][0];
