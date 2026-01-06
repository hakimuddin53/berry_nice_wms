import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { DataTable, PbCard } from "components/platbricks/shared";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import {
  PurchaseQualityReportRowDto,
  PurchaseQualityReportSearchDto,
} from "interfaces/v12/inventory/purchaseQualityReportDto";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInventoryService } from "services/InventoryService";

type ReportRow = PurchaseQualityReportRowDto & { rowId: number };

type ReportFilters = {
  search: string;
  fromDate: string;
  toDate: string;
};

const PurchaseQualityReportPage = () => {
  const { t } = useTranslation();
  const inventoryService = useInventoryService();
  const [filters, setFilters] = useState<ReportFilters>({
    search: "",
    fromDate: "",
    toDate: "",
  });

  const updateFilter = useCallback(
    <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const formatMoney = (value?: number | null) =>
    value === null || value === undefined ? "-" : value.toFixed(2);

  const headerCells: DataTableHeaderCell<ReportRow>[] = useMemo(
    () => [
      {
        id: "purchaser",
        label: t("user", { defaultValue: "User" }),
        render: (row) => row.purchaser,
      },
      {
        id: "purchaseTotal",
        label: t("purchase-total", { defaultValue: "Purchase Total" }),
        align: "right",
        render: (row) => formatMoney(row.purchaseTotal),
      },
      {
        id: "soldTotal",
        label: t("sold-total", { defaultValue: "Sold Total" }),
        align: "right",
        render: (row) => formatMoney(row.soldTotal),
      },
      {
        id: "profit",
        label: t("profit", { defaultValue: "Profit" }),
        align: "right",
        render: (row) => formatMoney(row.profit),
      },
    ],
    [formatMoney, t]
  );

  const buildPayload = useCallback(
    (page: number, pageSize: number, searchValue: string) => {
      const searchText = (searchValue ?? filters.search).trim();
      const payload: PurchaseQualityReportSearchDto = {
        search: searchText.length > 0 ? searchText : null,
        fromDate: filters.fromDate || null,
        toDate: filters.toDate || null,
        page: page + 1,
        pageSize,
      };
      return payload;
    },
    [filters]
  );

  const loadData = useCallback(
    async (page: number, pageSize: number, searchValue: string) => {
      const res = await inventoryService.searchPurchaseQualityReport(
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
      const res = await inventoryService.searchPurchaseQualityReport(
        buildPayload(page, pageSize, searchValue)
      );
      return res.totalCount ?? res.data.length ?? 0;
    },
    [inventoryService, buildPayload]
  );

  const { tableProps, reloadData, updateDatatableControls } =
    useDatatableControls<ReportRow>({
      initialData: [],
      loadData,
      loadDataCount,
    });

  const onSearch = () => {
    updateDatatableControls({ searchValue: filters.search, page: 0 });
    reloadData(true);
  };

  return (
    <Page
      title={t("purchase-quality-report", {
        defaultValue: "Purchase Quality Report",
      })}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("inventory") },
        {
          label: t("purchase-quality-report", {
            defaultValue: "Purchase Quality Report",
          }),
        },
      ]}
      showSearch
      renderSearch={() => (
        <PbCard sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("search")}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight={600}>
                  {t("keyword", { defaultValue: "Keyword" })}
                </Typography>
                <TextField
                  size="small"
                  placeholder={t("keyword", { defaultValue: "Keyword" })}
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight={600}>
                  {t("from-date", { defaultValue: "From Date" })}
                </Typography>
                <TextField
                  size="small"
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => updateFilter("fromDate", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight={600}>
                  {t("to-date", { defaultValue: "To Date" })}
                </Typography>
                <TextField
                  size="small"
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => updateFilter("toDate", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" onClick={onSearch}>
                  {t("search")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </PbCard>
      )}
    >
      <DataTable
        title={t("purchase-quality-report", {
          defaultValue: "Purchase Quality Report",
        })}
        tableKey="PurchaseQualityReportPage"
        headerCells={headerCells}
        data={tableProps}
        dataKey="rowId"
      />
    </Page>
  );
};

export default PurchaseQualityReportPage;
