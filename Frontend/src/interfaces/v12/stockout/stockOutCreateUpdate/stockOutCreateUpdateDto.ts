import { guid } from "types/guid";

export interface StockOutCreateUpdateDto {
  number?: string | null;
  doNumber: string;
  warehouseId: guid;
  stockOutItems: StockOutItemCreateUpdate[];
}
export interface StockOutItemCreateUpdate {
  productId: guid;
  locationId: guid;
  quantity: number;
}
