import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridFooterContainer,
  useGridApiRef,
  type GridColDef,
  type GridFilterModel,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Page from "components/platbricks/shared/Page";
import { type SelectAsyncOption } from "components/platbricks/shared/SelectAsync";
import { useUserDateTime } from "hooks/useUserDateTime";
import {
  InvoicedProductReportRowDto,
  InvoicedProductReportSearchDto,
} from "interfaces/v12/inventory/invoicedProductReportDto";
import jwtDecode from "jwt-decode";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInventoryService } from "services/InventoryService";
import { useProductService } from "services/ProductService";
import { guid } from "types/guid";
import * as XLSX from "xlsx";

type ReportRow = InvoicedProductReportRowDto & { rowId: number };
const MAX_PAGE_SIZE = 100000;

type ReportFilters = {
  search: string;
  product: SelectAsyncOption | null;
  model: string;
  warehouse: SelectAsyncOption | null;
  location: SelectAsyncOption | null;
  category: SelectAsyncOption | null;
  brand: SelectAsyncOption | null;
  color: SelectAsyncOption | null;
  storage: SelectAsyncOption | null;
  ram: SelectAsyncOption | null;
  processor: SelectAsyncOption | null;
  screenSize: SelectAsyncOption | null;
  grade: SelectAsyncOption | null;
  region: SelectAsyncOption | null;
  newOrUsed: SelectAsyncOption | null;
  fromDate: string;
  toDate: string;
};

const InvoicedProductsReportPage = () => {
  const { t } = useTranslation();
  const inventoryService = useInventoryService();
  const productService = useProductService();
  const { getLocalDate } = useUserDateTime();

  const isSalesTeamUser = useMemo(() => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("accessToken")
        : null;

    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const roleClaim =
        decoded?.Role ??
        decoded?.role ??
        decoded?.[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ??
        "";

      const normalized = String(roleClaim).replace(/\s+/g, "").toLowerCase();

      return normalized === "salesteam";
    } catch {
      return false;
    }
  }, []);

  const [filters, setFilters] = useState<ReportFilters>({
    search: "",
    product: null,
    model: "",
    warehouse: null,
    location: null,
    category: null,
    brand: null,
    color: null,
    storage: null,
    ram: null,
    processor: null,
    screenSize: null,
    grade: null,
    region: null,
    newOrUsed: null,
    fromDate: "",
    toDate: "",
  });
  const [reportTotal, setReportTotal] = useState<number | null>(null);
  const [reportTotalLoading, setReportTotalLoading] = useState(false);
  const [activeRow, setActiveRow] = useState<ReportRow | null>(null);

  const [rows, setRows] = useState<ReportRow[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [filteredRowIds, setFilteredRowIds] = useState<Set<number>>(new Set());
  const apiRef = useGridApiRef();

  const updateFilter = useCallback(
    <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const toGuid = useCallback((value?: string | null) => {
    if (!value) return null;
    return guid(value);
  }, []);

  const formatMoney = (value?: number | null) =>
    value === null || value === undefined ? "-" : value.toFixed(2);

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    try {
      return getLocalDate(value);
    } catch {
      return String(value);
    }
  };

  const formatText = (value?: string | number | null) =>
    value === null || value === undefined || value === "" ? "-" : String(value);

  const selectPlaceholder = t("select", { defaultValue: "Select" });

  const renderFilterField = useCallback(
    (label: string, control: JSX.Element) => (
      <Stack spacing={1}>
        <Typography variant="body2" fontWeight={600}>
          {label}
        </Typography>
        {control}
      </Stack>
    ),
    []
  );

  const columns: GridColDef<ReportRow>[] = useMemo(
    () => [
      {
        field: "productCode",
        headerName: t("product-code"),
        minWidth: 140,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "model",
        headerName: t("model"),
        minWidth: 140,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "warehouseLabel",
        headerName: t("warehouse"),
        minWidth: 140,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "locationLabel",
        headerName: t("location"),
        minWidth: 140,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "invoiceNumber",
        headerName: t("invoice-number", { defaultValue: "Invoice Number" }),
        minWidth: 160,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "dateOfSale",
        headerName: t("date-of-sale", { defaultValue: "Date of Sale" }),
        minWidth: 140,
        valueFormatter: (value: unknown) =>
          formatDate((value as string | null | undefined) ?? null),
        type: "dateTime",
      },
      ...(!isSalesTeamUser
        ? [
            {
              field: "costPrice",
              headerName: t("cost-price", { defaultValue: "Cost Price" }),
              type: "number" as const,
              minWidth: 120,
              valueGetter: (_value: unknown, row: ReportRow) =>
                row?.costPrice ?? null,
              valueFormatter: (value: number | null | undefined) =>
                value === null || value === undefined ? "-" : value.toFixed(2),
              align: "right" as const,
              headerAlign: "right" as const,
            },
          ]
        : []),
      {
        field: "retailPrice",
        headerName: t("retail-price", { defaultValue: "Retail Price" }),
        type: "number",
        minWidth: 120,
        valueGetter: (_value: unknown, row: ReportRow) =>
          row?.retailPrice ?? null,
        valueFormatter: (value: number | null | undefined) =>
          value === null || value === undefined ? "-" : value.toFixed(2),
        align: "right",
        headerAlign: "right",
      },
      {
        field: "agentPrice",
        headerName: t("agent-price", { defaultValue: "Agent Price" }),
        type: "number",
        minWidth: 120,
        valueGetter: (_value: unknown, row: ReportRow) =>
          row?.agentPrice ?? null,
        valueFormatter: (value: number | null | undefined) =>
          value === null || value === undefined ? "-" : value.toFixed(2),
        align: "right",
        headerAlign: "right",
      },
      {
        field: "dealerPrice",
        headerName: t("dealer-price", { defaultValue: "Dealer Price" }),
        type: "number",
        minWidth: 120,
        valueGetter: (_value: unknown, row: ReportRow) =>
          row?.dealerPrice ?? null,
        valueFormatter: (value: number | null | undefined) =>
          value === null || value === undefined ? "-" : value.toFixed(2),
        align: "right",
        headerAlign: "right",
      },
      {
        field: "unitPrice",
        headerName: t("unit-price-sold", { defaultValue: "Unit Price Sold" }),
        type: "number",
        minWidth: 150,
        valueGetter: (_value: unknown, row: ReportRow) => row?.unitPrice ?? 0,
        valueFormatter: (value: number | null | undefined) =>
          formatMoney(value ?? 0),
        align: "right",
        headerAlign: "right",
      },
      {
        field: "categoryLabel",
        headerName: t("category"),
        minWidth: 120,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "brandLabel",
        headerName: t("brand"),
        minWidth: 120,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "colorLabel",
        headerName: t("colour", { defaultValue: "Color" }),
        minWidth: 120,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "storageLabel",
        headerName: t("storage"),
        minWidth: 120,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "ramLabel",
        headerName: t("ram"),
        minWidth: 120,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "processorLabel",
        headerName: t("processor"),
        minWidth: 140,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "screenSizeLabel",
        headerName: t("screen-size"),
        minWidth: 120,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "gradeLabel",
        headerName: t("grade"),
        minWidth: 100,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "regionLabel",
        headerName: t("region"),
        minWidth: 120,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "newOrUsedLabel",
        headerName: t("new-or-used"),
        minWidth: 120,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "batteryHealth",
        headerName: t("battery-health", { defaultValue: "Battery Health" }),
        type: "number",
        minWidth: 130,
        valueFormatter: (value: number | null | undefined) =>
          value === null || value === undefined ? "-" : `${value}`,
      },
      {
        field: "remark",
        headerName: t("remark"),
        minWidth: 140,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "internalRemark",
        headerName: t("internal-remark"),
        minWidth: 160,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "serialNumber",
        headerName: t("serial-number", { defaultValue: "Serial Number" }),
        minWidth: 160,
        valueFormatter: (value: string | null | undefined) => formatText(value),
      },
      {
        field: "actions",
        headerName: "",
        sortable: false,
        filterable: false,
        width: 80,
        renderCell: (params: GridRenderCellParams<ReportRow>) =>
          params.row ? (
            <IconButton
              size="small"
              aria-label={t("view", { defaultValue: "View" })}
              onClick={(e) => {
                e.stopPropagation();
                setActiveRow(params.row);
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          ) : null,
      },
    ],
    [formatDate, formatMoney, isSalesTeamUser, t]
  );

  const buildPayload = useCallback(
    (_pageArg: number, _pageSizeArg: number, searchValue: string) => {
      const searchText = (searchValue ?? filters.search).trim();
      const modelText = filters.model.trim();
      const payload: InvoicedProductReportSearchDto = {
        search: searchText.length > 0 ? searchText : null,
        productId: toGuid(filters.product?.value),
        model: modelText.length > 0 ? modelText : null,
        warehouseId: toGuid(filters.warehouse?.value),
        locationId: toGuid(filters.location?.value),
        categoryId: toGuid(filters.category?.value),
        brandId: toGuid(filters.brand?.value),
        colorId: toGuid(filters.color?.value),
        storageId: toGuid(filters.storage?.value),
        ramId: toGuid(filters.ram?.value),
        processorId: toGuid(filters.processor?.value),
        screenSizeId: toGuid(filters.screenSize?.value),
        gradeId: toGuid(filters.grade?.value),
        regionId: toGuid(filters.region?.value),
        newOrUsedId: toGuid(filters.newOrUsed?.value),
        fromDate: filters.fromDate || null,
        toDate: filters.toDate || null,
        page: 1,
        pageSize: MAX_PAGE_SIZE,
      };

      return payload;
    },
    [filters, toGuid]
  );

  const fetchData = useCallback(
    async (_pageArg: number, _pageSizeArg: number, searchValue: string) => {
      setLoading(true);
      try {
        const res = await inventoryService.searchInvoicedReport(
          buildPayload(0, MAX_PAGE_SIZE, searchValue)
        );
        const mapped: ReportRow[] =
          res?.data?.map((item, index) => ({
            ...item,
            rowId: index,
          })) ?? [];
        setRows(mapped);
        setRowCount(res?.totalCount ?? mapped.length);
      } finally {
        setLoading(false);
      }
    },
    [buildPayload, inventoryService]
  );

  const onSearch = useCallback(() => {
    fetchData(0, MAX_PAGE_SIZE, filters.search);
    setReportTotal(null);
    setReportTotalLoading(true);
    inventoryService
      .getInvoicedReportTotal(buildPayload(0, 1, filters.search))
      .then((total) => setReportTotal(total))
      .catch(() => setReportTotal(null))
      .finally(() => setReportTotalLoading(false));
  }, [buildPayload, fetchData, filters.search, inventoryService]);

  useEffect(() => {
    fetchData(0, MAX_PAGE_SIZE, filters.search);
  }, [fetchData, filters.search]);

  const showTotal =
    rowCount > 0 && (reportTotalLoading || reportTotal !== null);

  // Check if any filter is active
  const isFilterActive = filterModel.items.length > 0;

  const priceTotals = useMemo(() => {
    const totals = {
      costPrice: 0,
      retailPrice: 0,
      agentPrice: 0,
      dealerPrice: 0,
      unitPrice: 0,
      totalPrice: 0,
    };
    // If filter is active, use filtered rows; otherwise use all rows
    const visibleRows =
      isFilterActive && filteredRowIds.size > 0
        ? rows.filter((row) => filteredRowIds.has(row.rowId))
        : isFilterActive
        ? [] // Filter active but no matching rows
        : rows; // No filter, use all rows
    visibleRows.forEach((row) => {
      totals.costPrice += row.costPrice ?? 0;
      totals.retailPrice += row.retailPrice ?? 0;
      totals.agentPrice += row.agentPrice ?? 0;
      totals.dealerPrice += row.dealerPrice ?? 0;
      totals.unitPrice += row.unitPrice ?? 0;
      totals.totalPrice += row.totalPrice ?? 0;
    });
    return totals;
  }, [rows, filteredRowIds, isFilterActive]);

  const handleFilterModelChange = useCallback(
    (model: GridFilterModel) => {
      setFilterModel(model);
      // Update filtered row IDs after filter changes
      setTimeout(() => {
        if (apiRef.current) {
          try {
            // Get the filtered rows lookup from the grid state
            const filteredRowsLookup =
              apiRef.current.state?.filter?.filteredRowsLookup;
            if (filteredRowsLookup) {
              // filteredRowsLookup contains { [rowId]: true/false }
              // true means the row passes the filter
              const visibleIds = Object.entries(filteredRowsLookup)
                .filter(([, isVisible]) => isVisible)
                .map(([id]) => Number(id));
              setFilteredRowIds(new Set(visibleIds));
            } else {
              // No filter applied, clear the set to show all rows
              setFilteredRowIds(new Set());
            }
          } catch {
            setFilteredRowIds(new Set());
          }
        }
      }, 0);
    },
    [apiRef]
  );

  // Export to Excel function
  const handleExportToExcel = useCallback(() => {
    // Get visible rows based on filter
    const visibleRows =
      isFilterActive && filteredRowIds.size > 0
        ? rows.filter((row) => filteredRowIds.has(row.rowId))
        : isFilterActive
        ? []
        : rows;

    // Build export data with headers (exclude actions column)
    const exportColumns = columns.filter((col) => col.field !== "actions");
    const headers = exportColumns.map((col) => col.headerName || col.field);

    const data = visibleRows.map((row) => {
      const rowData: Record<string, any> = {};
      exportColumns.forEach((col) => {
        const field = col.field;
        let value = (row as any)[field];

        // Format specific fields
        if (field === "dateOfSale") {
          value = formatDate(value);
        } else if (
          [
            "costPrice",
            "retailPrice",
            "agentPrice",
            "dealerPrice",
            "unitPrice",
            "totalPrice",
          ].includes(field)
        ) {
          value = value ?? 0;
        }

        rowData[col.headerName || field] = value ?? "";
      });
      return rowData;
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoiced Products Report");

    // Generate filename with date
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `invoiced_products_report_${dateStr}.xlsx`;

    // Download
    XLSX.writeFile(wb, filename);
  }, [columns, filteredRowIds, formatDate, isFilterActive, rows]);

  // Custom footer component with totals
  const TotalsFooter = useCallback(() => {
    const formatTotalValue = (val: number) => val.toFixed(2);
    return (
      <GridFooterContainer
        sx={{
          bgcolor: "grey.200",
          borderTop: "2px solid",
          borderColor: "divider",
          minHeight: 48,
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            px: 1,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <Box sx={{ minWidth: 140, pr: 1 }}>
            {t("totals", { defaultValue: "Totals" })}
          </Box>
          {/* Spacer for other columns - adjust based on column structure */}
          <Box sx={{ flex: 1 }} />
          {/* Price totals aligned to the right */}
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            {!isSalesTeamUser && (
              <Box sx={{ minWidth: 100, textAlign: "right" }}>
                <Typography variant="caption" color="text.secondary">
                  {t("cost-price", { defaultValue: "Cost Price" })}
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {formatTotalValue(priceTotals.costPrice)}
                </Typography>
              </Box>
            )}
            <Box sx={{ minWidth: 100, textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary">
                {t("retail-price", { defaultValue: "Retail Price" })}
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {formatTotalValue(priceTotals.retailPrice)}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 100, textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary">
                {t("agent-price", { defaultValue: "Agent Price" })}
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {formatTotalValue(priceTotals.agentPrice)}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 100, textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary">
                {t("dealer-price", { defaultValue: "Dealer Price" })}
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {formatTotalValue(priceTotals.dealerPrice)}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 120, textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary">
                {t("unit-price-sold", { defaultValue: "Unit Price Sold" })}
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {formatTotalValue(priceTotals.unitPrice)}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </GridFooterContainer>
    );
  }, [isSalesTeamUser, priceTotals, t]);

  const renderDetailRows = useCallback(
    (rows: { label: string; value: string }[]) => {
      const pairs: { label: string; value: string }[][] = [];
      for (let i = 0; i < rows.length; i += 2) {
        pairs.push(rows.slice(i, i + 2));
      }
      return (
        <Box sx={{ display: "grid", gap: 1 }}>
          {pairs.map((pair, index) => (
            <Box key={`${pair[0]?.label ?? "row"}-${index}`}>
              <Grid container spacing={2}>
                {pair.map((row) => (
                  <Grid item xs={12} sm={6} key={row.label}>
                    <Typography variant="caption" color="text.secondary">
                      {row.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {row.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      );
    },
    []
  );

  const detailRows = useMemo(() => {
    if (!activeRow) return [];
    return [
      { label: t("product-code"), value: formatText(activeRow.productCode) },
      { label: t("model"), value: formatText(activeRow.model) },
      { label: t("warehouse"), value: formatText(activeRow.warehouseLabel) },
      { label: t("location"), value: formatText(activeRow.locationLabel) },
      {
        label: t("invoice-number", { defaultValue: "Invoice Number" }),
        value: formatText(activeRow.invoiceNumber),
      },
      { label: t("date-of-sale"), value: formatDate(activeRow.dateOfSale) },
      { label: t("quantity"), value: formatText(activeRow.quantity) },
      ...(!isSalesTeamUser
        ? [
            {
              label: t("cost-price", { defaultValue: "Cost Price" }),
              value: formatMoney(activeRow.costPrice),
            },
          ]
        : []),
      {
        label: t("retail-price", { defaultValue: "Retail Price" }),
        value: formatMoney(activeRow.retailPrice),
      },
      {
        label: t("agent-price", { defaultValue: "Agent Price" }),
        value: formatMoney(activeRow.agentPrice),
      },
      {
        label: t("dealer-price", { defaultValue: "Dealer Price" }),
        value: formatMoney(activeRow.dealerPrice),
      },
      {
        label: t("unit-price", { defaultValue: "Unit Price" }),
        value: formatMoney(activeRow.unitPrice),
      },
      {
        label: t("total-price", { defaultValue: "Total Price" }),
        value: formatMoney(activeRow.totalPrice),
      },
    ];
  }, [activeRow, formatDate, formatMoney, formatText, isSalesTeamUser, t]);

  return (
    <>
      <Page
        title={t("invoiced-products-report", {
          defaultValue: "Invoiced Products Report",
        })}
        showBackdrop={loading}
        breadcrumbs={[
          { label: t("common:dashboard"), to: "/" },
          { label: t("inventory") },
          {
            label: t("invoiced-products-report", {
              defaultValue: "Invoiced Products Report",
            }),
          },
        ]}
      >
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportToExcel}
            disabled={loading || rows.length === 0}
          >
            {t("export-to-excel", { defaultValue: "Export to Excel" })}
          </Button>
        </Box>
        <Box
          sx={{
            height: { xs: 500, sm: 600, md: 700 },
            width: "100%",
            overflowX: "auto",
          }}
        >
          <DataGrid
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            loading={loading}
            rowCount={rowCount}
            getRowId={(row) => row.rowId}
            disableRowSelectionOnClick
            density="compact"
            rowHeight={48}
            filterMode="client"
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
            sx={{
              fontSize: 13,
              "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle": {
                whiteSpace: "normal",
                lineHeight: 1.25,
              },
              "& .MuiDataGrid-cell": {
                alignItems: "flex-start",
                py: 0.5,
              },
            }}
            slots={{
              loadingOverlay: () => (
                <Box sx={{ width: "100%", p: 2 }}>
                  <LinearProgress />
                </Box>
              ),
              footer: TotalsFooter,
            }}
          />
        </Box>
      </Page>

      <Dialog
        open={!!activeRow}
        onClose={() => setActiveRow(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t("invoiced-products-report", {
            defaultValue: "Invoiced Products Report",
          })}
        </DialogTitle>
        <DialogContent dividers>{renderDetailRows(detailRows)}</DialogContent>
        <DialogActions>
          <Button onClick={() => setActiveRow(null)}>
            {t("close", { defaultValue: "Close" })}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InvoicedProductsReportPage;
