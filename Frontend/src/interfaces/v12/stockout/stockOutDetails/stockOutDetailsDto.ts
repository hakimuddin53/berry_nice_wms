import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface StockOutDetailsDto extends CreatedChangedEntity {
  id: guid;
  number: string;
  doNumber: string;
  stockOutItems: StockOutItemDetailsDto[];
}
export interface StockOutItemDetailsDto extends CreatedChangedEntity {
  id: guid;
  stockOutId: guid;
  stockOutItemNumber: string;
  productId: guid;
  product: string;
  quantity: number;
}
