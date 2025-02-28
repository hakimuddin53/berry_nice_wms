import { guid } from "types/guid";

export interface StockTransferCreateUpdateDto {
  number?: string | null;
  stockTransferItems: StockTransferItemCreateUpdate[];
}
export interface StockTransferItemCreateUpdate {
  stockTransferItemNumber?: string | null;
  productId: guid;
  quantityTransferred: number;
  fromWarehouseId: guid;
  toWarehouseId: guid;
}
