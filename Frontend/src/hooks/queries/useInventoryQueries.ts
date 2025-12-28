import { useQuery } from "@tanstack/react-query";
import { useInventoryService } from "services/InventoryService";
import { inventoryQueryKeys } from "./queryKeys";

export const useInventoryAuditLogQuery = (productId?: string | null) => {
  const inventoryService = useInventoryService();

  return useQuery({
    queryKey: productId
      ? inventoryQueryKeys.auditLog(productId)
      : inventoryQueryKeys.all,
    queryFn: () => inventoryService.getProductAuditLog(productId as string),
    enabled: Boolean(productId),
    staleTime: 2 * 60 * 1000,
  });
};
