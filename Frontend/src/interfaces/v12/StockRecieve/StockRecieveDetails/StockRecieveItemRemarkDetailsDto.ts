import { guid } from "types/guid";

export interface StockRecieveItemRemarkDetailsDto {
  id: guid;
  StockRecieveItemId: guid;
  productRemarkId: guid;
  remark: string;
  createdAt?: string;
  createdById?: guid;
  changedAt?: string;
  changedById?: guid;
}

