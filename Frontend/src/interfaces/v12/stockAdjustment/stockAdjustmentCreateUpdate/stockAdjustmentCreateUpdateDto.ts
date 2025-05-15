import { guid } from "types/guid";

export interface StockAdjustmentCreateUpdateDto {
  number?: string | null;
  warehouseId: guid;
  stockAdjustmentItems: StockAdjustmentItemCreateUpdate[];
}
export interface StockAdjustmentItemCreateUpdate {
  productId: guid;
  quantity: number;
  locationId: guid;
  reason: string;
}
