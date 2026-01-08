import { guid } from "types/guid";
import { StockRecieveItemDetailsDto } from "./StockRecieveItemDetailsDto";

export interface StockRecieveDetailsDto {
  id: guid;
  number: string;
  sellerInfo: string;
  purchaser: string;
  purchaserName?: string;
  dateOfPurchase: string;
  warehouseId: guid;
  warehouseLabel: string;

  createdAt: string;
  createdById: string;
  changedAt?: string;
  changedById?: string;

  stockRecieveItems?: StockRecieveItemDetailsDto[];
}
