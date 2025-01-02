import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface StockInDetailsDto extends CreatedChangedEntity {
  id: guid;
  number: string;
  warehouseId: guid;
  stockInItemDetails: StockInItemDetailsDto[];
}
export interface StockInItemDetailsDto extends CreatedChangedEntity {
  id: guid;
  stockInId: guid;
  productId: guid;
  stockInItemNumber: string;
  quantity: number;
  productUomId: guid;
  listPrice: number;
}
