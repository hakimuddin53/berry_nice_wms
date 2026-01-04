import { guid } from "types/guid";

export interface InventorySummaryRowDto {
  productId: guid;
  productCode: string;
  model?: string | null;
  availableQuantity: number;
  warehouseId?: guid;
  warehouseLabel?: string;
  agentPrice?: number | null;
  dealerPrice?: number | null;
  retailPrice?: number | null;
}

export interface InventorySummarySearchDto {
  search?: string | null;
  page: number;
  pageSize: number;
  warehouseId?: guid | null;
  minQuantity?: number | null;
}
