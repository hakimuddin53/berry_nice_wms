import { guid } from "types/guid";

export interface StockTransferCreateUpdateDto {
  number?: string | null;
  stockTransferItems: StockTransferItemCreateUpdate[];
}
export interface StockTransferItemCreateUpdate {
  productId: guid;
  quantityTransferred: number;
  fromLocationId: guid;
  toLocationId: guid;
  fromWarehouseId: guid;
  toWarehouseId: guid;
}
