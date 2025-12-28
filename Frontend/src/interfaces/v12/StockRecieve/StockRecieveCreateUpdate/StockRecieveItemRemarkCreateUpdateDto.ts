import { guid } from "types/guid";

export interface StockRecieveItemRemarkCreateUpdateDto {
  id?: guid;
  StockRecieveItemId?: guid;
  productRemarkId?: guid;
  remark?: string;
}
