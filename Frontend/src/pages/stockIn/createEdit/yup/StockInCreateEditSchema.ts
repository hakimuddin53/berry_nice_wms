import { guid } from "types/guid";
import * as yup from "yup";

export const StockInCreateEditSchema = yup.object({
  number: yup.string().required(),
  warehouseId: yup.mixed<guid>().required(),
  stockInItems: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string(),
        stockInItemNumber: yup.string().required().max(32),
        productId: yup.mixed<guid>().required(),
        productUomId: yup.mixed<guid>().required(),
        quantity: yup.number().required(),
        listPrice: yup.number().required(),
      })
    )
    .required(),
});

export type YupStockInCreateEdit = yup.InferType<
  typeof StockInCreateEditSchema
>;
export type YupStockInItemsCreateEdit = YupStockInCreateEdit["stockInItems"][0];
