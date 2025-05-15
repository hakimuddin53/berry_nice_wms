import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface StockAdjustmentDetailsDto extends CreatedChangedEntity {
  id: guid;
  number: string;
  warehouseId: guid;
  stockAdjustmentItems: StockAdjustmentItemDetailsDto[];
}
export interface StockAdjustmentItemDetailsDto extends CreatedChangedEntity {
  id: guid;
  stockAdjustmentId: guid;
  productId: guid;
  locationId: guid;
  quantity: number;
  reason: string;
}
