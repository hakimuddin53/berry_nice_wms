import { ReservationStatusEnum } from "interfaces/enums/GlobalEnums";
import { guid } from "types/guid";
import * as yup from "yup";

export const StockReservationCreateEditSchema = yup.object({
  number: yup.string().nullable(),
  warehouseId: yup.mixed<guid>().required(),
  reservedAt: yup.string().required(), // auto set to datetime.now (read-only)
  expiresAt: yup.string().required(), // auto set to 3 days from now
  status: yup.string().oneOf(Object.values(ReservationStatusEnum)).required(),
  stockReservationItems: yup
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

export type YupStockReservationCreateEdit = yup.InferType<
  typeof StockReservationCreateEditSchema
>;
export type YupStockReservationItemsCreateEdit =
  YupStockReservationCreateEdit["stockReservationItems"][0];
