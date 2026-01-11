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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataTable, PbCard } from "components/platbricks/shared";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import Page from "components/platbricks/shared/Page";
import SelectAsync, {
  type SelectAsyncOption,
} from "components/platbricks/shared/SelectAsync";
import { useDatatableControls } from "hooks/useDatatableControls";
import { useUserDateTime } from "hooks/useUserDateTime";
import {
  InvoicedProductReportRowDto,
  InvoicedProductReportSearchDto,
} from "interfaces/v12/inventory/invoicedProductReportDto";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInventoryService } from "services/InventoryService";
import { useProductService } from "services/ProductService";
import { guid } from "types/guid";

type ReportRow = InvoicedProductReportRowDto & { rowId: number };

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

  const headerCells: DataTableHeaderCell<ReportRow>[] = useMemo(
    () => [
      { id: "productCode", label: t("product-code") },
      { id: "model", label: t("model") },
      { id: "warehouseLabel", label: t("warehouse") },
      {
        id: "locationLabel",
        label: t("location"),
        render: (row) => row.locationLabel || "-",
      },
      {
        id: "invoiceNumber",
        label: t("invoice-number", { defaultValue: "Invoice Number" }),
      },
      {
        id: "dateOfSale",
        label: t("date-of-sale"),
        render: (row) => formatDate(row.dateOfSale),
      },
      {
        id: "quantity",
        label: t("quantity"),
        align: "right",
      },
      {
        id: "unitPrice",
        label: t("unit-price", { defaultValue: "Unit Price" }),
        align: "right",
        render: (row) => formatMoney(row.unitPrice),
      },
      {
        id: "actions",
        label: "",
        render: (row) => (
          <IconButton
            size="small"
            aria-label={t("view", { defaultValue: "View" })}
            onClick={(e) => {
              e.stopPropagation();
              setActiveRow(row);
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [formatMoney, t]
  );

  const buildPayload = useCallback(
    (page: number, pageSize: number, searchValue: string) => {
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
        page: page + 1,
        pageSize,
      };

      return payload;
    },
    [filters, toGuid]
  );

  const loadData = useCallback(
    async (page: number, pageSize: number, searchValue: string) => {
      const res = await inventoryService.searchInvoicedReport(
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
      const res = await inventoryService.searchInvoicedReport(
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
    setReportTotal(null);
    setReportTotalLoading(true);
    inventoryService
      .getInvoicedReportTotal(buildPayload(0, 1, filters.search))
      .then((total) => setReportTotal(total))
      .catch(() => setReportTotal(null))
      .finally(() => setReportTotalLoading(false));
  };

  useEffect(() => {
    // Auto-load latest invoiced report on first render
    onSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalCount = tableProps.totalCount ?? 0;
  const showTotal =
    totalCount > 0 && (reportTotalLoading || reportTotal !== null);

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
      {
        label: t("unit-price", { defaultValue: "Unit Price" }),
        value: formatMoney(activeRow.unitPrice),
      },
      {
        label: t("total-price", { defaultValue: "Total Price" }),
        value: formatMoney(activeRow.totalPrice),
      },
    ];
  }, [activeRow, formatDate, formatMoney, formatText, t]);

  return (
    <>
      <Page
        title={t("invoiced-products-report", {
          defaultValue: "Invoiced Products Report",
        })}
        breadcrumbs={[
          { label: t("common:dashboard"), to: "/" },
          { label: t("inventory") },
          {
            label: t("invoiced-products-report", {
              defaultValue: "Invoiced Products Report",
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
                {renderFilterField(
                  t("keyword", { defaultValue: "Keyword" }),
                  <TextField
                    size="small"
                    placeholder={t("keyword", { defaultValue: "Keyword" })}
                    value={filters.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    fullWidth
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("product"),
                  <SelectAsync
                    name="productId"
                    placeholder={selectPlaceholder}
                    suggestionsIfEmpty
                    asyncFunc={(label, page, pageSize) =>
                      productService.getSelectOptions(label, page, pageSize)
                    }
                    initValue={filters.product ?? undefined}
                    onSelectionChange={(option) =>
                      updateFilter("product", option ?? null)
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("model"),
                  <TextField
                    size="small"
                    placeholder={t("model")}
                    value={filters.model}
                    onChange={(e) => updateFilter("model", e.target.value)}
                    fullWidth
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("warehouse"),
                  <LookupAutocomplete
                    name="warehouseId"
                    groupKey={LookupGroupKey.Warehouse}
                    placeholder={selectPlaceholder}
                    value={filters.warehouse?.value ?? ""}
                    onChange={(_, option) =>
                      updateFilter(
                        "warehouse",
                        option
                          ? { label: option.label, value: option.value }
                          : null
                      )
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("location"),
                  <LookupAutocomplete
                    name="locationId"
                    groupKey={LookupGroupKey.Location}
                    placeholder={selectPlaceholder}
                    value={filters.location?.value ?? ""}
                    onChange={(_, option) =>
                      updateFilter(
                        "location",
                        option
                          ? { label: option.label, value: option.value }
                          : null
                      )
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("category"),
                  <LookupAutocomplete
                    name="categoryId"
                    groupKey={LookupGroupKey.ProductCategory}
                    placeholder={selectPlaceholder}
                    value={filters.category?.value ?? ""}
                    onChange={(_, option) =>
                      updateFilter(
                        "category",
                        option
                          ? { label: option.label, value: option.value }
                          : null
                      )
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("brand"),
                  <LookupAutocomplete
                    name="brandId"
                    groupKey={LookupGroupKey.Brand}
                    placeholder={selectPlaceholder}
                    value={filters.brand?.value ?? ""}
                    onChange={(_, option) =>
                      updateFilter(
                        "brand",
                        option
                          ? { label: option.label, value: option.value }
                          : null
                      )
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("colour"),
                  <LookupAutocomplete
                    name="colorId"
                    groupKey={LookupGroupKey.Color}
                    placeholder={selectPlaceholder}
                    value={filters.color?.value ?? ""}
                    onChange={(_, option) =>
                      updateFilter(
                        "color",
                        option
                          ? { label: option.label, value: option.value }
                          : null
                      )
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("storage"),
                  <LookupAutocomplete
                    name="storageId"
                    groupKey={LookupGroupKey.Storage}
                    placeholder={selectPlaceholder}
                    value={filters.storage?.value ?? ""}
                    onChange={(_, option) =>
                      updateFilter(
                        "storage",
                        option
                          ? { label: option.label, value: option.value }
                          : null
                      )
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("ram"),
                  <LookupAutocomplete
                    name="ramId"
                    groupKey={LookupGroupKey.Ram}
                    placeholder={selectPlaceholder}
                    value={filters.ram?.value ?? ""}
                    onChange={(_, option) =>
                      updateFilter(
                        "ram",
                        option
                          ? { label: option.label, value: option.value }
                          : null
                      )
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("processor"),
                  <LookupAutocomplete
                    name="processorId"
                    groupKey={LookupGroupKey.Processor}
                    placeholder={selectPlaceholder}
                    value={filters.processor?.value ?? ""}
                    onChange={(_, option) =>
                      updateFilter(
                        "processor",
                        option
                          ? { label: option.label, value: option.value }
                          : null
                      )
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("screen-size"),
                  <LookupAutocomplete
                    name="screenSizeId"
                    groupKey={LookupGroupKey.ScreenSize}
                    placeholder={selectPlaceholder}
                    value={filters.screenSize?.value ?? ""}
                    onChange={(_, option) =>
                      updateFilter(
                        "screenSize",
                        option
                          ? { label: option.label, value: option.value }
                          : null
                      )
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("grade"),
                  <LookupAutocomplete
                    name="gradeId"
                    groupKey={LookupGroupKey.Grade}
                    placeholder={selectPlaceholder}
                    value={filters.grade?.value ?? ""}
                    onChange={(_, option) =>
                      updateFilter(
                        "grade",
                        option
                          ? { label: option.label, value: option.value }
                          : null
                      )
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("region"),
                  <LookupAutocomplete
                    name="regionId"
                    groupKey={LookupGroupKey.Region}
                    placeholder={selectPlaceholder}
                    value={filters.region?.value ?? ""}
                    onChange={(_, option) =>
                      updateFilter(
                        "region",
                        option
                          ? { label: option.label, value: option.value }
                          : null
                      )
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("new-or-used"),
                  <LookupAutocomplete
                    name="newOrUsedId"
                    groupKey={LookupGroupKey.NewOrUsed}
                    placeholder={selectPlaceholder}
                    value={filters.newOrUsed?.value ?? ""}
                    onChange={(_, option) =>
                      updateFilter(
                        "newOrUsed",
                        option
                          ? { label: option.label, value: option.value }
                          : null
                      )
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("from-date", { defaultValue: "From Date" }),
                  <TextField
                    size="small"
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => updateFilter("fromDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderFilterField(
                  t("to-date", { defaultValue: "To Date" }),
                  <TextField
                    size="small"
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => updateFilter("toDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                )}
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
          title={t("invoiced-products-report", {
            defaultValue: "Invoiced Products Report",
          })}
          tableKey="InvoicedProductsReportPage"
          headerCells={headerCells}
          data={tableProps}
          dataKey="rowId"
        />
        {showTotal && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="subtitle2">
                {t("total-price", { defaultValue: "Total Price" })}
              </Typography>
              <Typography variant="h6">
                {reportTotalLoading
                  ? t("common:loading", { defaultValue: "Loading" })
                  : formatMoney(reportTotal)}
              </Typography>
            </Stack>
          </Box>
        )}
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
