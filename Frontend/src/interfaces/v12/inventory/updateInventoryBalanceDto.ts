export interface UpdateInventoryBalanceDto {
  remark?: string | null;
  internalRemark?: string | null;
  agentPrice?: number | null;
  dealerPrice?: number | null;
  retailPrice?: number | null;
  costPrice?: number | null;
  locationId?: string | null;
}
