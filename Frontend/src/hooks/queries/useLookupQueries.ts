import { useQueryClient } from "@tanstack/react-query";
import { SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useCallback } from "react";
import { useLookupService } from "services/LookupService";
import { lookupQueryKeys } from "./queryKeys";

export const useLookupByIdFetcher = () => {
  const lookupService = useLookupService();
  const queryClient = useQueryClient();

  return useCallback(
    (lookupId: string) =>
      queryClient.fetchQuery({
        queryKey: lookupQueryKeys.byId(lookupId),
        queryFn: () => lookupService.getById(lookupId),
        staleTime: 2 * 60 * 1000,
      }),
    [lookupService, queryClient]
  );
};

export const useLookupSelectOptionsFetcher = () => {
  const lookupService = useLookupService();
  const queryClient = useQueryClient();

  return useCallback(
    (
      groupKey: LookupGroupKey,
      search: string,
      page: number,
      pageSize: number,
      ids?: string[]
    ) =>
      queryClient.fetchQuery({
        queryKey: lookupQueryKeys.selectOptions(groupKey, {
          search,
          page,
          pageSize,
          ids,
        }),
        queryFn: () =>
          lookupService.getSelectOptions(groupKey, search, page, pageSize, ids),
        staleTime: 2 * 60 * 1000,
      }) as Promise<SelectAsyncOption[]>,
    [lookupService, queryClient]
  );
};
