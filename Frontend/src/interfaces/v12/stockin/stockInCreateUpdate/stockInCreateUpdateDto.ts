import { guid } from "types/guid";

export interface StockInCreateUpdateDto {
  number: string;
  warehouseId: guid;
  stockInItems: StockInItemCreateUpdate[] | null;
}
export interface StockInItemCreateUpdate {
  stockInItemNumber: string;
  productId: guid;
  quantity: number;
  productUomId: guid;
  listPrice: number;
}
