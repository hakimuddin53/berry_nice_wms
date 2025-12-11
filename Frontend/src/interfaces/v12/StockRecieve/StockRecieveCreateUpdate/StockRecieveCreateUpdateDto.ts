import { guid } from "types/guid";
import { StockRecieveItemCreateUpdateDto } from "./StockRecieveItemCreateUpdateDto";

export interface StockRecieveCreateUpdateDto {
  sellerInfo: string;
  purchaser: string;
  dateOfPurchase: string;
  warehouseId: guid;
  StockRecieveItems?: StockRecieveItemCreateUpdateDto[];
}

