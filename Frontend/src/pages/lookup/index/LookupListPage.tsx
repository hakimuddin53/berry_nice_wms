// pages/lookups/LookupListPage.tsx
import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import { LookupDetailsDto, LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useLookupService } from "services/LookupService";
import { useLookupTable } from "./datatables/useLookupTable";

function LookupListPageInner({ group }: { group: LookupGroupKey }) {
  const { t } = useTranslation();
  const [cols] = useLookupTable();
  const svc = useLookupService();

  const title = useMemo(() => t(`lookups:${group}`, group), [group, t]);
  const breadcrumbs = useMemo(
    () => [
      { label: t("common:dashboard"), to: "/" },
      { label: t("lookups"), to: "/lookups" },
      { label: title },
    ],
    [t, title]
  );

  const getSearch = useCallback(
    (page: number, pageSize: number, searchValue: string) => ({
      groupKey: group,
      search: searchValue,
      activeOnly: true,
      page, // 0-based; service converts to 1-based
      pageSize,
    }),
    [group]
  );

  const loadData = useCallback(
    (page: number, pageSize: number, searchValue: string) =>
      svc.search(getSearch(page, pageSize, searchValue)),
    [svc, getSearch]
  );

  const loadCount = useCallback(
    (_page: number, pageSize: number, searchValue: string) =>
      svc.count({
        groupKey: group,
        search: searchValue,
        activeOnly: true,
        page: 1,
        pageSize,
      }),
    [svc, group]
  );

  const { tableProps, reloadData } = useDatatableControls<LookupDetailsDto>({
    initialData: [],
    loadData,
    loadDataCount: loadCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={title}
      breadcrumbs={breadcrumbs}
      hasSingleActionButton
      actions={[{ title: t("lookups:new", "New"), icon: "Add", to: "new" }]}
    >
      <DataTable
        key={`DataTable-${group}`} // force child remount too (extra safe)
        title={title}
        tableKey={`LookupListPage-${group}`}
        headerCells={cols}
        data={tableProps}
        dataKey="id"
        showSearch
      />
    </Page>
  );
}

export default function LookupListPage() {
  const { groupKey } = useParams();
  if (!groupKey) return null;

  // If your LookupGroupKey is a string enum, this cast is fine.
  const group = groupKey as LookupGroupKey;

  // ✅ Key the inner component by group, so it remounts on URL change
  return <LookupListPageInner key={groupKey} group={group} />;
}
