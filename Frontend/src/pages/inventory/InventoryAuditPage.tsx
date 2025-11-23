import { Box, Button, TextField } from "@mui/material";
import Page from "components/platbricks/shared/Page";
import { DataTable } from "components/platbricks/shared";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { useDatatableControls } from "hooks/useDatatableControls";
import { InventoryAuditDto } from "interfaces/v12/inventory/inventoryAuditDto";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInventoryService } from "services/InventoryService";

type AuditRow = InventoryAuditDto & { rowId: number };

const InventoryAuditPage = () => {
  const { t } = useTranslation();
  const inventoryService = useInventoryService();
  const [search, setSearch] = useState("");

  const headerCells: DataTableHeaderCell<AuditRow>[] = useMemo(
    () => [
      { id: "productCode", label: t("product-code") },
      { id: "model", label: t("model"), render: (row) => row.model ?? "-" },
      {
        id: "movementDate",
        label: t("date"),
        render: (row) => <UserDateTime date={row.movementDate} />,
      },
      { id: "movementType", label: t("movement-type") },
      { id: "referenceNumber", label: t("reference-number") },
      {
        id: "quantityChange",
        label: t("quantity"),
        render: (row) =>
          row.quantityChange > 0
            ? `+${row.quantityChange}`
            : row.quantityChange.toString(),
      },
      {
        id: "balanceAfter",
        label: t("balance"),
        render: (row) => row.balanceAfter.toString(),
      },
      {
        id: "costPrice",
        label: t("cost"),
        render: (row) =>
          row.costPrice != null ? row.costPrice.toString() : "-",
      },
      {
        id: "agentPrice",
        label: t("agent"),
        render: (row) =>
          row.agentPrice != null ? row.agentPrice.toString() : "-",
      },
      {
        id: "dealerPrice",
        label: t("dealer"),
        render: (row) =>
          row.dealerPrice != null ? row.dealerPrice.toString() : "-",
      },
      {
        id: "retailPrice",
        label: t("retail"),
        render: (row) =>
          row.retailPrice != null ? row.retailPrice.toString() : "-",
      },
    ],
    [t]
  );

  const loadData = useCallback(
    async (page: number, pageSize: number, searchValue: string) => {
      const payload = {
        search: searchValue ?? search,
        page: page + 1,
        pageSize,
      };
      const res = await inventoryService.searchAudit(payload);
      return (res.data || []).map((item, index) => ({
        ...item,
        rowId: page * pageSize + index,
      }));
    },
    [inventoryService, search]
  );

  const loadDataCount = useCallback(
    async (page: number, pageSize: number, searchValue: string) => {
      const payload = {
        search: searchValue ?? search,
        page: page + 1,
        pageSize,
      };
      const res = await inventoryService.searchAudit(payload);
      return res.totalCount ?? res.data.length ?? 0;
    },
    [inventoryService, search]
  );

  const { tableProps, reloadData, updateDatatableControls } =
    useDatatableControls<AuditRow>({
      initialData: [],
      loadData,
      loadDataCount,
    });

  const onSearch = () => {
    updateDatatableControls({ searchValue: search, page: 0 });
    reloadData(true);
  };

  return (
    <Page
      title={t("inventory-audit-trail")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("inventory") },
        { label: t("inventory-audit-trail") },
      ]}
      showSearch
      renderSearch={() => (
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label={t("search")}
            value={search}
            size="small"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="contained" onClick={onSearch}>
            {t("search")}
          </Button>
        </Box>
      )}
    >
      <DataTable
        title={t("inventory-audit-trail")}
        tableKey="InventoryAuditPage"
        headerCells={headerCells}
        data={tableProps}
        dataKey="rowId"
      />
    </Page>
  );
};

export default InventoryAuditPage;
