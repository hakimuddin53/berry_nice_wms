import { guid } from "types/guid";

export interface StockOutCreateUpdateDto {
  number?: string | null;
  doNumber: string;
  soNumber: string;
  warehouseId: guid;
  toLocation: string;
  stockOutItems: StockOutItemCreateUpdate[];
}
export interface StockOutItemCreateUpdate {
  productId: guid;
  locationId: guid;
  quantity: number;
}
