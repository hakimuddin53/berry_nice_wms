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
  productId: guid;
  product: string;
  quantityTransferred: number;
  fromLocationId: guid;
  fromLocation: string;
  toLocationId: guid;
  toLocation: string;

  fromWarehouseId: guid;
  fromWarehouse: string;
  toWarehouseId: guid;
  toWarehouse: string;
}
