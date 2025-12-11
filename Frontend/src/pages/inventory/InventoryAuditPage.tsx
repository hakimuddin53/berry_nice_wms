import { Box, Button, TextField } from "@mui/material";
import { BadgeText, DataTable } from "components/platbricks/shared";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import Page from "components/platbricks/shared/Page";
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
        id: "warehouseLabel",
        label: t("warehouse"),
        render: (row) => row.warehouseLabel || "-",
      },
      {
        id: "movementDate",
        label: t("date"),
        render: (row) => <UserDateTime date={row.movementDate} />,
      },
      {
        id: "movementType",
        label: t("movement-type"),
        render: (row) => (
          <BadgeText
            color={row.quantityIn >= row.quantityOut ? "success" : "error"}
          >
            {row.movementType}
          </BadgeText>
        ),
      },
      {
        id: "referenceNumber",
        label: t("reference-number"),
        render: (row) => row.referenceNumber || "-",
      },
      { id: "quantityIn", label: t("quantity-in"), align: "right" },
      { id: "quantityOut", label: t("quantity-out"), align: "right" },
      { id: "oldBalance", label: t("old-balance"), align: "right" },
      { id: "newBalance", label: t("new-balance"), align: "right" },
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
