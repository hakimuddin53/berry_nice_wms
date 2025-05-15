import { guid } from "types/guid";
import * as yup from "yup";

export const StockAdjustmentCreateEditSchema = yup.object({
  number: yup.string().nullable(),
  warehouseId: yup.mixed<guid>().required(),
  stockAdjustmentItems: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string(),
        productId: yup.mixed<guid>().required(),
        locationId: yup.mixed<guid>().required(),
        quantity: yup.number().required(),
        reason: yup.string().required(),
      })
    )
    .required(),
});

export type YupStockAdjustmentCreateEdit = yup.InferType<
  typeof StockAdjustmentCreateEditSchema
>;
export type YupStockAdjustmentItemsCreateEdit =
  YupStockAdjustmentCreateEdit["stockAdjustmentItems"][0];
