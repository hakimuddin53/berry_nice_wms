import { InventoryAuditSearchDto } from "interfaces/v12/inventory/inventoryAuditDto";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";

type SelectOptionsParams = {
  search: string;
  page: number;
  pageSize: number;
  ids?: string[];
};

export const inventoryQueryKeys = {
  all: ["inventory"] as const,
  audit: (payload: InventoryAuditSearchDto) =>
    [...inventoryQueryKeys.all, "audit", payload] as const,
  auditLog: (productId: string) =>
    [...inventoryQueryKeys.all, "audit-log", productId] as const,
};

export const productQueryKeys = {
  all: ["product"] as const,
  byId: (productId: string) =>
    [...productQueryKeys.all, "by-id", productId] as const,
  selectOptions: (params: SelectOptionsParams) =>
    [...productQueryKeys.all, "select-options", params] as const,
};

export const lookupQueryKeys = {
  all: ["lookup"] as const,
  byId: (lookupId: string) =>
    [...lookupQueryKeys.all, "by-id", lookupId] as const,
  selectOptions: (groupKey: LookupGroupKey, params: SelectOptionsParams) =>
    [...lookupQueryKeys.all, "select-options", groupKey, params] as const,
};
