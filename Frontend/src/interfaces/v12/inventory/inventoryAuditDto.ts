import { guid } from "types/guid";

export interface InventoryAuditDto {
  productId: guid;
  productCode: string;
  model?: string | null;
  warehouseId: guid;
  warehouseLabel?: string | null;
  movementDate: string;
  movementType: string;
  referenceNumber: string;
  quantityIn: number;
  quantityOut: number;
  oldBalance: number;
  newBalance: number;
}

export interface InventoryAuditSearchDto {
  search?: string | null;
  productId?: guid | null;
  page: number;
  pageSize: number;
}
