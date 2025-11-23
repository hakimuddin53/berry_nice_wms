import { Box, Button, TextField } from "@mui/material";
import Page from "components/platbricks/shared/Page";
import { DataTable } from "components/platbricks/shared";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useDatatableControls } from "hooks/useDatatableControls";
import {
  InventorySummaryRowDto,
  InventorySummarySearchDto,
} from "interfaces/v12/inventory/inventorySummaryDto";
import { UpdateProductPricingDto } from "interfaces/v12/inventory/updateProductPricingDto";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInventoryService } from "services/InventoryService";

type SummaryRow = InventorySummaryRowDto & { rowId: number };
type EditablePrice = Record<
  string,
  Partial<UpdateProductPricingDto> & { dirty?: boolean }
>;

const InventorySummaryPage = () => {
  const { t } = useTranslation();
  const inventoryService = useInventoryService();
  const [search, setSearch] = useState("");
  const [edits, setEdits] = useState<EditablePrice>({});

  const setPrice = (
    productId: string,
    field: keyof UpdateProductPricingDto,
    value: number | string | ""
  ) => {
    setEdits((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value === "" ? null : Number(value),
        dirty: true,
      },
    }));
  };

  const savePricing = async (productId: string) => {
    const payload = edits[productId];
    if (!payload || !payload.dirty) return;
    const { dirty, ...dto } = payload;
    await inventoryService.updatePricing(productId, dto);
    setEdits((prev) => ({ ...prev, [productId]: { ...dto, dirty: false } }));
    reloadData();
  };

  const priceInput = (
    productId: string,
    field: keyof UpdateProductPricingDto,
    current?: number | null
  ) => {
    const key = edits[productId];
    const value =
      key && key[field] !== undefined && key[field] !== null
        ? key[field]
        : current ?? "";
    return (
      <TextField
        size="small"
        type="number"
        value={value === null ? "" : value}
        onChange={(e) => setPrice(productId, field, e.target.value)}
      />
    );
  };

  const headerCells: DataTableHeaderCell<SummaryRow>[] = useMemo(
    () => [
      { id: "productCode", label: t("product-code") },
      { id: "model", label: t("model"), render: (row) => row.model ?? "-" },
      { id: "availableQuantity", label: t("available-quantity") },
      {
        id: "costPrice",
        label: t("cost"),
        render: (row) =>
          priceInput(row.productId as string, "costPrice", row.costPrice),
      },
      {
        id: "agentPrice",
        label: t("agent"),
        render: (row) =>
          priceInput(row.productId as string, "agentPrice", row.agentPrice),
      },
      {
        id: "dealerPrice",
        label: t("dealer"),
        render: (row) =>
          priceInput(row.productId as string, "dealerPrice", row.dealerPrice),
      },
      {
        id: "retailPrice",
        label: t("retail"),
        render: (row) =>
          priceInput(row.productId as string, "retailPrice", row.retailPrice),
      },
      {
        id: "actions",
        label: "",
        render: (row) => (
          <Button
            size="small"
            variant="outlined"
            onClick={() => savePricing(row.productId as string)}
          >
            {t("save")}
          </Button>
        ),
      },
    ],
    [t, edits]
  );

  const buildPayload = useCallback(
    (page: number, pageSize: number, searchValue: string) =>
      ({
        search: searchValue ?? search,
        page: page + 1,
        pageSize,
      } as InventorySummarySearchDto),
    [search]
  );

  const loadData = useCallback(
    async (page: number, pageSize: number, searchValue: string) => {
      const res = await inventoryService.searchSummary(
        buildPayload(page, pageSize, searchValue)
      );
      return (res.data || []).map((item, index) => ({
        ...item,
        rowId: page * pageSize + index,
      }));
    },
    [inventoryService, buildPayload]
  );

  const loadDataCount = useCallback(
    async (page: number, pageSize: number, searchValue: string) => {
      const res = await inventoryService.searchSummary(
        buildPayload(page, pageSize, searchValue)
      );
      return res.totalCount ?? res.data.length ?? 0;
    },
    [inventoryService, buildPayload]
  );

  const { tableProps, reloadData, updateDatatableControls } =
    useDatatableControls<SummaryRow>({
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
      title={t("inventory-summary")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("inventory") },
        { label: t("inventory-summary") },
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
        title={t("inventory-summary")}
        tableKey="InventorySummaryPage"
        headerCells={headerCells}
        data={tableProps}
        dataKey="rowId"
      />
    </Page>
  );
};

export default InventorySummaryPage;
