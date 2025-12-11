import { guid } from "types/guid";

export interface InventorySummaryRowDto {
  productId: guid;
  productCode: string;
  model?: string | null;
  availableQuantity: number;
  agentPrice?: number | null;
  dealerPrice?: number | null;
  retailPrice?: number | null;
}

export interface InventorySummarySearchDto {
  search?: string | null;
  page: number;
  pageSize: number;
}
