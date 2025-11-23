import { guid } from "types/guid";

export interface InventoryAuditDto {
  productId: guid;
  productCode: string;
  model?: string | null;
  movementDate: string;
  movementType: string;
  referenceNumber: string;
  quantityChange: number;
  balanceAfter: number;
  costPrice?: number | null;
  agentPrice?: number | null;
  dealerPrice?: number | null;
  retailPrice?: number | null;
}

export interface InventoryAuditSearchDto {
  search?: string | null;
  productId?: guid | null;
  page: number;
  pageSize: number;
}
