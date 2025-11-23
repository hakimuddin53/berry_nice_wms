import { guid } from "types/guid";

export interface StockInItemRemarkDetailsDto {
  id: guid;
  stockInItemId: guid;
  productRemarkId: guid;
  remark: string;
  createdAt?: string;
  createdById?: guid;
  changedAt?: string;
  changedById?: guid;
}
