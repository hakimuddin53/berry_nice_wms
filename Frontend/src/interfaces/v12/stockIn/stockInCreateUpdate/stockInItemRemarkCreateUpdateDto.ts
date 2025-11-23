import { guid } from "types/guid";

export interface StockInItemRemarkCreateUpdateDto {
  id?: guid;
  stockInItemId?: guid;
  productRemarkId?: guid;
  remark?: string;
}
