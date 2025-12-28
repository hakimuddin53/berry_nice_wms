import { useQueryClient } from "@tanstack/react-query";
import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { useCallback } from "react";
import { useProductService } from "services/ProductService";
import { productQueryKeys } from "./queryKeys";

export const useProductByIdFetcher = () => {
  const productService = useProductService();
  const queryClient = useQueryClient();

  return useCallback(
    (productId: string) =>
      queryClient.fetchQuery({
        queryKey: productQueryKeys.byId(productId),
        queryFn: () => productService.getProductById(productId),
        staleTime: 2 * 60 * 1000,
      }),
    [productService, queryClient]
  );
};

export const useProductSelectOptionsFetcher = () => {
  const productService = useProductService();
  const queryClient = useQueryClient();

  return useCallback(
    (search: string, page: number, pageSize: number, ids?: string[]) =>
      queryClient.fetchQuery({
        queryKey: productQueryKeys.selectOptions({
          search,
          page,
          pageSize,
          ids,
        }),
        queryFn: () =>
          productService.getSelectOptions(search, page, pageSize, ids),
        staleTime: 2 * 60 * 1000,
      }) as Promise<SelectAsyncOption[]>,
    [productService, queryClient]
  );
};
