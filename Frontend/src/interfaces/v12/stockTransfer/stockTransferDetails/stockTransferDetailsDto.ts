import { CreatedChangedEntity } from "interfaces/v12/CreatedChangedEntity";
import { guid } from "types/guid";

export interface StockTransferDetailsDto extends CreatedChangedEntity {
  id: guid;
  number: string;
  stockTransferItems: StockTransferItemDetailsDto[];
}
export interface StockTransferItemDetailsDto extends CreatedChangedEntity {
  id: guid;
  stockTransferId: guid;
  stockTransferItemNumber?: string | null;
  productId: guid;
  product: string;
  quantityTransferred: number;
  fromWarehouseId: guid;
  fromWarehouse: string;
  toWarehouseId: guid;
  toWarehouse: string;
}
