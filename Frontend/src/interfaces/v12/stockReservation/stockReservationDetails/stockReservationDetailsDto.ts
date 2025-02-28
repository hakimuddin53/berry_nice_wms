import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface StockReservationDetailsDto extends CreatedChangedEntity {
  id: guid;
  number: string;
  productId: guid;
  quantity: number;
  reservationDate: string;
  expirationDate: string;
}
