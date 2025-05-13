import { guid } from "types/guid";

export interface StockInCreateUpdateDto {
  number?: string | null;
  poNumber: string;
  warehouseId: guid;
  locationId: guid;
  stockInItems: StockInItemCreateUpdate[] | null;
}
export interface StockInItemCreateUpdate {
  productId: guid;
  quantity: number;
}
