import HistoryIcon from "@mui/icons-material/History";
import PrintIcon from "@mui/icons-material/Print";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataTable, PbCard } from "components/platbricks/shared";
import BarcodeLabel, {
  BarcodeLabelData,
} from "components/platbricks/shared/BarcodeLabel";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import Page from "components/platbricks/shared/Page";
import SelectAsync, {
  type SelectAsyncOption,
} from "components/platbricks/shared/SelectAsync";
import SelectAsync2 from "components/platbricks/shared/SelectAsync2";
import { useInventoryAuditLogQuery } from "hooks/queries/useInventoryQueries";
import {
  useLookupByIdFetcher,
  useLookupSelectOptionsFetcher,
} from "hooks/queries/useLookupQueries";
import {
  useProductByIdFetcher,
  useProductSelectOptionsFetcher,
} from "hooks/queries/useProductQueries";
import { useDatatableControls } from "hooks/useDatatableControls";
import { useUserDateTime } from "hooks/useUserDateTime";
import { InventoryAuditDto } from "interfaces/v12/inventory/inventoryAuditDto";
import { UpdateInventoryBalanceDto } from "interfaces/v12/inventory/updateInventoryBalanceDto";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { ProductDetailsDto } from "interfaces/v12/product/productDetails/productDetailsDto";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { useInventoryService } from "services/InventoryService";
import { guid } from "types/guid";

type BalanceRow = InventoryAuditDto & { rowId: number };

type ProductExtras = {
  remark?: string | null;
  internalRemark?: string | null;
  retailPrice?: number | null;
  costPrice?: number | null;
  locationId?: string | null;
  locationLabel?: string;
  model?: string | null;
  ram?: string | null;
  storage?: string | null;
  processor?: string | null;
  screenSize?: string | null;
  gradeName?: string | null;
  productCode?: string;
  brand?: string | null;
  category?: string | null;
  serialNumber?: string | null;
};

type InventorySearchFilters = {
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
};

const parseRemarkSelections = (value?: string | null) => {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((option) => option.trim())
        .filter((option) => option.length > 0)
    )
  );
};

const InventoryPage = () => {
  const { t } = useTranslation();
  const inventoryService = useInventoryService();
  const fetchProductById = useProductByIdFetcher();
  const fetchProductOptions = useProductSelectOptionsFetcher();
  const fetchLookupById = useLookupByIdFetcher();
  const fetchLookupOptions = useLookupSelectOptionsFetcher();
  const { getLocalDateAndTime } = useUserDateTime();

  const [filters, setFilters] = useState<InventorySearchFilters>({
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
  });
  const [productExtras, setProductExtras] = useState<
    Record<string, ProductExtras>
  >({});
  const [activeBalanceRow, setActiveBalanceRow] = useState<BalanceRow | null>(
    null
  );
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ProductExtras>({});
  const [saving, setSaving] = useState(false);
  const [historyProductId, setHistoryProductId] = useState<string | null>(null);
  const [labelData, setLabelData] = useState<BarcodeLabelData | null>(null);
  const [printRequested, setPrintRequested] = useState(false);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const { data: historyLogs = [], isLoading: historyLoading } =
    useInventoryAuditLogQuery(historyProductId);

  const updateFilter = useCallback(
    <K extends keyof InventorySearchFilters>(
      key: K,
      value: InventorySearchFilters[K]
    ) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const selectedRemarks = useMemo(
    () => parseRemarkSelections(formValues.remark),
    [formValues.remark]
  );

  const remarkAsync = useCallback(
    async (input: string, page: number, pageSize: number, ids?: string[]) => {
      let lookupRemarkOptions: string[] = [];

      try {
        const chunk =
          (await fetchLookupOptions(
            LookupGroupKey.Remark,
            input ?? "",
            page,
            pageSize
          )) ?? [];
        lookupRemarkOptions = chunk
          .map((option) => option.label?.trim() ?? "")
          .filter((label) => label.length > 0);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error("Failed to load remark lookups", err);
        }
      }

      const merged = [
        ...lookupRemarkOptions,
        ...selectedRemarks,
        ...(ids ?? []),
      ].filter(Boolean);

      const unique = Array.from(new Set(merged));
      const term = (input ?? "").trim().toLowerCase();
      const filtered = term
        ? unique.filter((option) => option.toLowerCase().includes(term))
        : unique;
      return filtered.map((option) => ({ label: option, value: option }));
    },
    [fetchLookupOptions, selectedRemarks]
  );

  const formatNumber = (value?: number | null) =>
    value === null || value === undefined ? "-" : value.toString();

  const formatText = (value?: string | number | null) =>
    value === null || value === undefined || value === "" ? "-" : String(value);

  const formatDateTime = (value?: string | Date | null) => {
    if (!value) return "-";
    try {
      return getLocalDateAndTime(value);
    } catch {
      return String(value);
    }
  };

  const toGuid = useCallback((value?: string | null) => {
    if (!value) return null;
    return guid(value);
  }, []);

  const getLocationDisplay = useCallback(
    (row: BalanceRow) =>
      formatText(
        productExtras[row.productId]?.locationLabel ??
          productExtras[row.productId]?.locationId ??
          t("no-location")
      ),
    [formatText, productExtras, t]
  );

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

  const headerCells: DataTableHeaderCell<BalanceRow>[] = useMemo(
    () => [
      {
        id: "productCode",
        label: t("product-code"),
        render: (row) => formatText(row.productCode),
      },
      {
        id: "model",
        label: t("model"),
        render: (row) => formatText(row.model),
      },
      {
        id: "ageDays",
        label: t("stock-age-days", { defaultValue: "Age (days)" }),
        align: "right",
        render: (row) => formatNumber(row.ageDays),
      },
      {
        id: "warehouseLabel",
        label: t("warehouse"),
        render: (row) => formatText(row.warehouseLabel),
      },
      {
        id: "locationId",
        label: t("location"),
        render: (row) => formatText(getLocationDisplay(row)),
      },
      {
        id: "remark",
        label: t("remark"),
        render: (row) => formatText(productExtras[row.productId]?.remark),
      },
      {
        id: "internalRemark",
        label: t("internal-remark"),
        render: (row) =>
          formatText(productExtras[row.productId]?.internalRemark),
      },
      {
        id: "retailPrice",
        label: t("retail-selling-price"),
        align: "right",
        render: (row) =>
          formatNumber(productExtras[row.productId]?.retailPrice),
      },
      {
        id: "costPrice",
        label: t("cost"),
        align: "right",
        render: (row) => formatNumber(productExtras[row.productId]?.costPrice),
      },
      {
        id: "actions",
        label: "",
        render: (row) => (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={(event) => {
                event.stopPropagation();
                setActiveBalanceRow(row);
              }}
            >
              {t("view", { defaultValue: "View" })}
            </Button>
            <IconButton
              size="small"
              color="primary"
              onClick={() => openHistory(row.productId as string)}
              aria-label={t("history")}
            >
              <HistoryIcon fontSize="small" />
            </IconButton>
            <Button
              size="small"
              variant="contained"
              onClick={(event) => {
                event.stopPropagation();
                setActiveBalanceRow(row);
              }}
            >
              {t("view", { defaultValue: "View" })}
            </Button>
            <IconButton
              size="small"
              color="primary"
              onClick={() => printLabel(row)}
              aria-label={t("print")}
            >
              <PrintIcon fontSize="small" />
            </IconButton>
            <Button
              size="small"
              variant="text"
              onClick={() => openEdit(row.productId as string)}
            >
              {t("edit")}
            </Button>
          </Stack>
        ),
      },
    ],
    [formatNumber, formatText, getLocationDisplay, productExtras, t]
  );

  const dedupeLatestBalances = (items: InventoryAuditDto[]) => {
    const map = new Map<string, InventoryAuditDto>();
    items.forEach((item) => {
      const existing = map.get(item.productId as string);
      if (!existing) {
        map.set(item.productId as string, item);
        return;
      }
      const currentDate = new Date(item.movementDate).getTime();
      const existingDate = new Date(existing.movementDate).getTime();
      if (currentDate > existingDate) {
        map.set(item.productId as string, item);
      }
    });
    return Array.from(map.values());
  };

  const buildExtras = (product: ProductDetailsDto): ProductExtras => ({
    remark: product.remark ?? "",
    internalRemark: product.internalRemark ?? "",
    retailPrice: product.retailPrice ?? null,
    costPrice: product.costPrice ?? null,
    locationId: product.locationId ?? null,
    model: product.model ?? null,
    ram: product.ram ?? null,
    storage: product.storage ?? null,
    processor: product.processor ?? null,
    screenSize: product.screenSize ?? null,
    gradeName: product.gradeName ?? null,
    productCode: product.productCode,
    brand: product.brand ?? null,
    category: product.category ?? null,
    serialNumber: product.serialNumber ?? null,
  });

  const hydrateLocationLabels = useCallback(
    async (locationIds: string[]) => {
      const unique = Array.from(
        new Set(
          locationIds.filter(
            (loc) =>
              loc &&
              !Object.values(productExtras).some(
                (p) => p.locationId === loc && p.locationLabel
              )
          )
        )
      );
      if (unique.length === 0) return;

      const labelPairs = await Promise.all(
        unique.map(async (id) => {
          try {
            const lookup = await fetchLookupById(id);
            return [id, lookup.label] as [string, string];
          } catch {
            return [id, undefined] as [string, string | undefined];
          }
        })
      );

      setProductExtras((prev) => {
        const updated = { ...prev };
        labelPairs.forEach(([id, label]) => {
          Object.entries(updated).forEach(([productId, extras]) => {
            if (extras.locationId === id) {
              updated[productId] = {
                ...extras,
                locationLabel: label ?? extras.locationLabel,
              };
            }
          });
        });
        return updated;
      });
    },
    [fetchLookupById, productExtras]
  );

  const hydrateProductExtras = useCallback(
    async (productIds: string[]) => {
      const missing = productIds.filter((id) => !productExtras[id]);
      if (missing.length === 0) {
        return;
      }

      const results = await Promise.all(
        missing.map(async (id) => {
          try {
            const product = await fetchProductById(id);
            return [id, buildExtras(product)] as [string, ProductExtras];
          } catch (err) {
            console.warn("Failed to load product for balance row", id, err);
            return [id, {}] as [string, ProductExtras];
          }
        })
      );

      const next = { ...productExtras };
      results.forEach(([id, extras]) => {
        next[id] = extras;
      });
      setProductExtras(next);
      await hydrateLocationLabels(
        results
          .map(([, extras]) => extras.locationId)
          .filter(Boolean) as string[]
      );
    },
    [fetchProductById, hydrateLocationLabels, productExtras]
  );

  const buildPayload = useCallback(
    (page: number, pageSize: number, searchValue: string) => {
      const searchText = (searchValue ?? filters.search).trim();
      const modelText = filters.model.trim();

      return {
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
        page: page + 1,
        pageSize,
      };
    },
    [filters, toGuid]
  );

  const loadData = useCallback(
    async (page: number, pageSize: number, searchValue: string) => {
      const res = await inventoryService.searchAudit(
        buildPayload(page, pageSize, searchValue)
      );
      const deduped = dedupeLatestBalances(res.data || []);
      hydrateProductExtras(deduped.map((d) => d.productId as string));
      return deduped.map((item, index) => ({
        ...item,
        rowId: page * pageSize + index,
      }));
    },
    [inventoryService, buildPayload, hydrateProductExtras]
  );

  const loadDataCount = useCallback(
    async (page: number, pageSize: number, searchValue: string) => {
      const res = await inventoryService.searchAudit(
        buildPayload(page, pageSize, searchValue)
      );
      return dedupeLatestBalances(res.data || []).length;
    },
    [inventoryService, buildPayload]
  );

  const { tableProps, reloadData, updateDatatableControls } =
    useDatatableControls<BalanceRow>({
      initialData: [],
      loadData,
      loadDataCount,
    });

  const onSearch = () => {
    updateDatatableControls({ searchValue: filters.search, page: 0 });
    reloadData(true);
  };

  const openEdit = async (productId: string) => {
    let extras = productExtras[productId];
    if (!extras) {
      try {
        const product = await fetchProductById(productId);
        extras = buildExtras(product);
        setProductExtras((prev) => ({ ...prev, [productId]: extras! }));
        if (product.locationId)
          await hydrateLocationLabels([product.locationId as string]);
      } catch (err) {
        console.warn("Failed to fetch product for edit", err);
      }
    }
    setFormValues(extras || {});
    setEditingProductId(productId);
  };

  const closeDialog = () => {
    setEditingProductId(null);
    setFormValues({});
    setSaving(false);
  };

  const closeHistory = () => {
    setHistoryProductId(null);
  };

  const updateField = (
    field: keyof ProductExtras,
    value: string | number | null
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value as any }));
  };

  const openHistory = (productId: string) => {
    setHistoryProductId(productId);
  };

  const handlePrint = useReactToPrint({
    content: () => labelRef.current,
    documentTitle: labelData?.code ?? "label",
    pageStyle: "@page { size: 60mm 33mm; margin: 0; } body { margin: 0; }",
    onAfterPrint: () => setLabelData(null),
  });

  useEffect(() => {
    if (printRequested && labelData && handlePrint) {
      handlePrint();
      setPrintRequested(false);
    }
  }, [printRequested, labelData, handlePrint]);

  const buildLabelPayload = (row: BalanceRow): BarcodeLabelData => {
    const extras = productExtras[row.productId] || {};
    const code = extras.productCode ?? row.productCode ?? row.productId ?? "";

    return {
      code,
      model: extras.model ?? row.model ?? null,
      ram: extras.ram ?? null,
      storage: extras.storage ?? null,
      processor: extras.processor ?? null,
      screenSize: extras.screenSize ?? null,
      remark: extras.remark ?? null,
      warehouse: row.warehouseLabel ?? null,
      serialNumber: extras.serialNumber ?? null,
      brand: extras.brand ?? null,
      category: extras.category ?? null,
    };
  };

  const printLabel = (row: BalanceRow) => {
    setLabelData(buildLabelPayload(row));
    setPrintRequested(true);
  };

  const onSave = async () => {
    if (!editingProductId) return;
    const payload: UpdateInventoryBalanceDto = {
      remark: formValues.remark ?? null,
      internalRemark: formValues.internalRemark ?? null,
      retailPrice: formValues.retailPrice ?? null,
      costPrice: formValues.costPrice ?? null,
      locationId: formValues.locationId ?? null,
    };
    setSaving(true);
    try {
      await inventoryService.updateBalance(editingProductId, payload);
      setProductExtras((prev) => ({
        ...prev,
        [editingProductId]: {
          ...(prev[editingProductId] || {}),
          ...payload,
        },
      }));
      if (payload.locationId) {
        await hydrateLocationLabels([payload.locationId]);
      }
      closeDialog();
      reloadData();
    } catch (err) {
      console.error("Failed to update inventory balance row", err);
      setSaving(false);
    }
  };

  useEffect(() => {
    if (tableProps.data?.length) {
      hydrateProductExtras(
        (tableProps.data as BalanceRow[]).map((row) => row.productId as string)
      );
    }
  }, [tableProps.data, hydrateProductExtras]);

  const balanceDetailRows = useMemo(() => {
    if (!activeBalanceRow) {
      return [];
    }

    const extras = productExtras[activeBalanceRow.productId] || {};

    return [
      {
        label: t("product-code"),
        value: formatText(extras.productCode ?? activeBalanceRow.productCode),
      },
      {
        label: t("model"),
        value: formatText(extras.model ?? activeBalanceRow.model),
      },
      {
        label: t("warehouse"),
        value: formatText(activeBalanceRow.warehouseLabel),
      },
      {
        label: t("location"),
        value: formatText(getLocationDisplay(activeBalanceRow)),
      },
      { label: t("remark"), value: formatText(extras.remark) },
      { label: t("internal-remark"), value: formatText(extras.internalRemark) },
      {
        label: t("retail-selling-price"),
        value: formatNumber(extras.retailPrice),
      },
      {
        label: t("cost"),
        value: formatNumber(extras.costPrice ?? 0),
      },
      { label: t("ram"), value: formatText(extras.ram) },
      { label: t("storage"), value: formatText(extras.storage) },
      { label: t("processor"), value: formatText(extras.processor) },
      { label: t("screen-size"), value: formatText(extras.screenSize) },
      { label: t("grade"), value: formatText(extras.gradeName) },
    ];
  }, [
    activeBalanceRow,
    formatDateTime,
    formatNumber,
    formatText,
    getLocationDisplay,
    productExtras,
    t,
  ]);

  return (
    <>
      <Page
        title={t("inventory")}
        breadcrumbs={[
          { label: t("common:dashboard"), to: "/" },
          { label: t("inventory") },
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
                      fetchProductOptions(label, page, pageSize)
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
          title={t("inventory")}
          tableKey="InventoryPage"
          headerCells={headerCells}
          data={tableProps}
          dataKey="rowId"
        />
      </Page>

      <Dialog
        open={!!editingProductId}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t("edit-balance-row")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <SelectAsync2
              name="remark"
              label={t("remark")}
              placeholder={t("remark")}
              ids={selectedRemarks}
              isMulti
              suggestionsIfEmpty
              asyncFunc={remarkAsync}
              onSelectionChange={(options) => {
                const selections = options?.map((option) => option.value) ?? [];
                updateField(
                  "remark",
                  selections.length > 0 ? selections.join(", ") : null
                );
              }}
            />
            <TextField
              label={t("internal-remark")}
              value={formValues.internalRemark ?? ""}
              onChange={(e) => updateField("internalRemark", e.target.value)}
              multiline
              minRows={2}
            />
            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }} />
              <Box sx={{ flex: 1 }} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label={t("retail-selling-price")}
                type="number"
                value={formValues.retailPrice ?? ""}
                onChange={(e) =>
                  updateField(
                    "retailPrice",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                fullWidth
              />
              <TextField
                label={t("cost")}
                type="number"
                value={formValues.costPrice ?? ""}
                onChange={(e) =>
                  updateField(
                    "costPrice",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                fullWidth
              />
            </Stack>
            <SelectAsync
              name="locationId"
              label={t("location")}
              placeholder={t("location")}
              asyncFunc={(label, page, pageSize) =>
                fetchLookupOptions(
                  LookupGroupKey.Location,
                  label ?? "",
                  page,
                  pageSize,
                  formValues.locationId ? [formValues.locationId] : undefined
                )
              }
              initValue={
                formValues.locationId
                  ? {
                      label:
                        productExtras[editingProductId ?? ""]?.locationLabel ??
                        t("location"),
                      value: formValues.locationId,
                    }
                  : undefined
              }
              onSelectionChange={(option) =>
                updateField(
                  "locationId",
                  option ? (option.value as string) : null
                )
              }
            />
            {productExtras[editingProductId ?? ""]?.locationId &&
              !productExtras[editingProductId ?? ""]?.locationLabel && (
                <Typography variant="caption" color="textSecondary">
                  {t("loading")}
                </Typography>
              )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>{t("cancel")}</Button>
          <Button variant="contained" onClick={onSave} disabled={saving}>
            {t("save")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(activeBalanceRow)}
        onClose={() => setActiveBalanceRow(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t("inventory-balance-details", {
            defaultValue: "Inventory Balance Details",
          })}
        </DialogTitle>
        <DialogContent dividers>
          {renderDetailRows(balanceDetailRows)}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActiveBalanceRow(null)}>
            {t("close", { defaultValue: "Close" })}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!historyProductId}
        onClose={closeHistory}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t("history")}</DialogTitle>
        <DialogContent dividers>
          {historyLoading && <LinearProgress />}
          {!historyLoading && historyLogs.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              {t("no-history", { defaultValue: "No history available." })}
            </Typography>
          )}
          {!historyLoading &&
            historyLogs.map((log) => (
              <Box
                key={log.id}
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  py: 1.5,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="subtitle2">
                    {log.propertyName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {getLocalDateAndTime(log.changedAt)}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <Chip
                    size="small"
                    label={log.oldValue ?? "-"}
                    color="default"
                    variant="outlined"
                  />
                  <Typography variant="body2">-&gt;</Typography>
                  <Chip
                    size="small"
                    label={log.newValue ?? "-"}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
                <Typography variant="caption" color="textSecondary">
                  {t("changed-by", { defaultValue: "Changed by" })}:{" "}
                  {log.changedBy}
                </Typography>
              </Box>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHistory}>{t("close")}</Button>
        </DialogActions>
      </Dialog>

      {labelData && (
        <Box
          sx={{
            position: "fixed",
            left: -10000,
            top: 0,
            width: 0,
            height: 0,
            overflow: "hidden",
          }}
        >
          <BarcodeLabel ref={labelRef} data={labelData} />
        </Box>
      )}
    </>
  );
};

export default InventoryPage;
