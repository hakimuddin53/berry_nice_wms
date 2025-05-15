import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface StockInDetailsDto extends CreatedChangedEntity {
  id: guid;
  number: string;
  poNumber: string;
  warehouseId: guid;
  stockInItems: StockInItemDetailsDto[];
}
export interface StockInItemDetailsDto extends CreatedChangedEntity {
  id: guid;
  stockInId: guid;
  productId: guid;
  locationId: guid;
  quantity: number;
}
