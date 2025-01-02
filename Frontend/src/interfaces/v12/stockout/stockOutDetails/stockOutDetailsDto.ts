import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface StockOutDetailsDto extends CreatedChangedEntity {
  id: guid;
  number: string;
  warehouseId: guid;
  stockOutItemDetails: StockOutItemDetailsDto[];
}
export interface StockOutItemDetailsDto extends CreatedChangedEntity {
  id: guid;
  stockOutId: guid;
  stockOutItemNumber: string;
  productId: guid;
  quantity: number;
  productUomId: guid;
  listPrice: number;
}
