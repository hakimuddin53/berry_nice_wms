import { guid } from "types/guid";

export interface StockOutCreateUpdateDto {
  number: string;
  warehouseId: guid;
  stockOutItems: StockOutItemCreateUpdate[];
}
export interface StockOutItemCreateUpdate {
  stockOutItemNumber: string;
  productId: guid;
  quantity: number;
  productUomId: guid;
  listPrice: number;
}
