import { guid } from "types/guid";

export interface InventoryAuditDto {
  productId: guid;
  productCode: string;
  model?: string | null;
  ageDays: number;
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
  model?: string | null;
  warehouseId?: guid | null;
  locationId?: guid | null;
  categoryId?: guid | null;
  brandId?: guid | null;
  colorId?: guid | null;
  storageId?: guid | null;
  ramId?: guid | null;
  processorId?: guid | null;
  screenSizeId?: guid | null;
  gradeId?: guid | null;
  regionId?: guid | null;
  newOrUsedId?: guid | null;
  page: number;
  pageSize: number;
}
