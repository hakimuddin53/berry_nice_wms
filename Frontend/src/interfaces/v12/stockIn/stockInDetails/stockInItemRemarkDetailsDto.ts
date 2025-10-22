import { guid } from "types/guid";

export interface StockInItemRemarkDetailsDto {
  id: guid;
  stockInItemId: guid;
  remark: string;
  createdAt?: string;
  createdById?: guid;
  changedAt?: string;
  changedById?: guid;
}
