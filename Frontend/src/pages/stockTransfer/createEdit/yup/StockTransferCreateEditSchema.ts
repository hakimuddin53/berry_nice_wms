import { guid } from "types/guid";
import * as yup from "yup";

export const StockTransferCreateEditSchema = yup.object({
  number: yup.string().nullable(),
  stockTransferItems: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string(),
        productId: yup.mixed<guid>().required(),
        quantityTransferred: yup.number().required(),
        fromLocationId: yup.mixed<guid>().required(),
        toLocationId: yup.mixed<guid>().required(),
        fromWarehouseId: yup.mixed<guid>().required(),
        toWarehouseId: yup.mixed<guid>().required(),
      })
    )
    .required(),
});

export type YupStockTransferCreateEdit = yup.InferType<
  typeof StockTransferCreateEditSchema
>;
export type YupStockTransferItemsCreateEdit =
  YupStockTransferCreateEdit["stockTransferItems"][0];
