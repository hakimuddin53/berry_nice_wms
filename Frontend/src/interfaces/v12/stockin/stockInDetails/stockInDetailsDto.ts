import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface StockInDetailsDto extends CreatedChangedEntity {
  id: guid;
  number: string;
  poNumber: string;
  jsNumber: string;
  warehouseId: guid;
  fromLocation: string;
  stockInItems: StockInItemDetailsDto[];
}
export interface StockInItemDetailsDto extends CreatedChangedEntity {
  id: guid;
  stockInId: guid;
  productId: guid;
  locationId: guid;
  quantity: number;
  unitPrice: number;
}
