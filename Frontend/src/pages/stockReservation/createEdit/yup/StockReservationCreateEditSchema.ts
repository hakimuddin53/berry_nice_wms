import { guid } from "types/guid";
import * as yup from "yup";

export const StockReservationCreateEditSchema = yup.object({
  number: yup.string().required(),
  productId: yup.mixed<guid>().required(),
  quantity: yup.number().required(),
});

export type YupStockReservationCreateEdit = yup.InferType<
  typeof StockReservationCreateEditSchema
>;
