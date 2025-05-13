import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface StockOutDetailsDto extends CreatedChangedEntity {
  id: guid;
  number: string;
  doNumber: string;
  warehouseId: guid;
  warehouse: string;
  locationId: guid;
  location: string;
  stockOutItems: StockOutItemDetailsDto[];
}
export interface StockOutItemDetailsDto extends CreatedChangedEntity {
  id: guid;
  stockOutId: guid;
  productId: guid;
  product: string;
  quantity: number;
}
