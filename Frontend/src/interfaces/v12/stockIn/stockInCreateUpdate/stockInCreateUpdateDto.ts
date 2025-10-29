import { guid } from "types/guid";
import { StockInItemCreateUpdateDto } from "./stockInItemCreateUpdateDto";

export interface StockInCreateUpdateDto {
  number: string;
  sellerInfo: string;
  purchaser: string;
  dateOfPurchase: string;
  warehouseId: guid;
  stockInItems?: StockInItemCreateUpdateDto[];
}
