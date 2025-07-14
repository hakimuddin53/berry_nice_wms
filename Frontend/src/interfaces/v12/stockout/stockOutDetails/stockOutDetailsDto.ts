import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface StockOutDetailsDto extends CreatedChangedEntity {
  id: guid;
  number: string;
  doNumber: string;
  warehouseId: guid;
  toLocation: string;
  stockOutItems: StockOutItemDetailsDto[];
}
export interface StockOutItemDetailsDto extends CreatedChangedEntity {
  id: guid;
  stockOutId: guid;
  productId: guid;
  quantity: number;
  locationId: guid;
}
