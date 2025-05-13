import { guid } from "types/guid";
import * as yup from "yup";

export const StockOutCreateEditSchema = yup.object({
  number: yup.string().nullable(),
  doNumber: yup.string().required(),
  warehouseId: yup.mixed<guid>().required(),
  locationId: yup.mixed<guid>().required(),
  stockOutItems: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string(),
        productId: yup.mixed<guid>().required(),
        quantity: yup.number().required(),
      })
    )
    .required(),
});

export type YupStockOutCreateEdit = yup.InferType<
  typeof StockOutCreateEditSchema
>;
export type YupStockOutItemsCreateEdit =
  YupStockOutCreateEdit["stockOutItems"][0];
