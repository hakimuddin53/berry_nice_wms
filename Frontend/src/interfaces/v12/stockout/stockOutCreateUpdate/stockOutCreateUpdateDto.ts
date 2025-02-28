import { guid } from "types/guid";

export interface StockOutCreateUpdateDto {
  number?: string | null;
  doNumber: string;
  stockOutItems: StockOutItemCreateUpdate[];
}
export interface StockOutItemCreateUpdate {
  stockOutItemNumber?: string | null;
  productId: guid;
  quantity: number;
}
