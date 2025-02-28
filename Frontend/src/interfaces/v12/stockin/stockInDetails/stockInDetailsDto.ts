import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface StockInDetailsDto extends CreatedChangedEntity {
  id: guid;
  number: string;
  poNumber: string;
  warehouseId: guid;
  warehouse: string;
  locationId: guid;
  location: string;
  stockInItems: StockInItemDetailsDto[];
}
export interface StockInItemDetailsDto extends CreatedChangedEntity {
  id: guid;
  stockInId: guid;
  stockInItemNumber: string;
  productId: guid;
  product: string;
  quantity: number;
}
