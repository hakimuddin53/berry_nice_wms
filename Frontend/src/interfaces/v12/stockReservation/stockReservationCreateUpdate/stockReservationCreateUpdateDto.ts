import { guid } from "types/guid";

export interface StockReservationCreateUpdateDto {
  number: string;
  productId: guid;
  quantity: number;
  reservationDate: string;
  expirationDate: string;
}
