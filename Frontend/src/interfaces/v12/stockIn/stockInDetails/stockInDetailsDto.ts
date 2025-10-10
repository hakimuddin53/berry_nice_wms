import { guid } from "types/guid";
import { StockInItemDetailsDto } from "./stockInItemDetailsDto";

export interface StockInDetailsDto {
  id: guid;
  number: string;
  sellerInfo: string;
  purchaser: string;
  location: string;
  dateOfPurchase: string;
  warehouseId: guid;

  createdAt: string;
  createdById: string;
  changedAt?: string;
  changedById?: string;

  stockInItems?: StockInItemDetailsDto[];
}