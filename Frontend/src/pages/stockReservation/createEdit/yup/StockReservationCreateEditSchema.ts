import { guid } from "types/guid";
import * as yup from "yup";

export const StockReservationCreateEditSchema = yup.object({
  number: yup.string().required(),
  productId: yup.mixed<guid>().required(),
  quantity: yup.number().required(),
  reservationDate: yup.string().required(),
  expirationDate: yup.string().required(),
});

export type YupStockReservationCreateEdit = yup.InferType<
  typeof StockReservationCreateEditSchema
>;
