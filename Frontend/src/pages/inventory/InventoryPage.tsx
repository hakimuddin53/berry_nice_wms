import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import HistoryIcon from "@mui/icons-material/History";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import InputAdornment from "@mui/material/InputAdornment";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import UserName from "components/platbricks/entities/UserName";
import { PbCard } from "components/platbricks/shared";
import BarcodeLabel, {
  BarcodeLabelData,
} from "components/platbricks/shared/BarcodeLabel";
import Page from "components/platbricks/shared/Page";
import SelectAsync, {
  type SelectAsyncOption,
} from "components/platbricks/shared/SelectAsync";
import SelectAsync2 from "components/platbricks/shared/SelectAsync2";
import { productQueryKeys } from "hooks/queries/queryKeys";
import { useInventoryAuditLogQuery } from "hooks/queries/useInventoryQueries";
import {
  useLookupByIdFetcher,
  useLookupSelectOptionsFetcher,
} from "hooks/queries/useLookupQueries";
import {
  useProductByIdFetcher,
  useProductSelectOptionsFetcher,
} from "hooks/queries/useProductQueries";
import { useUserDateTime } from "hooks/useUserDateTime";
import { PagedListDto } from "interfaces/general/pagedList/PagedListDto";
import { InventoryAuditDto } from "interfaces/v12/inventory/inventoryAuditDto";
import { UpdateInventoryBalanceDto } from "interfaces/v12/inventory/updateInventoryBalanceDto";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { ProductDetailsDto } from "interfaces/v12/product/productDetails/productDetailsDto";
import jwtDecode from "jwt-decode";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { useInventoryService } from "services/InventoryService";
import { useProductService } from "services/ProductService";
import { guid } from "types/guid";
import * as XLSX from "xlsx";

type BalanceRow = InventoryAuditDto & { rowId: number };

type ProductExtras = {
  remark?: string | null;
  internalRemark?: string | null;
  retailPrice?: number | null;
  dealerPrice?: number | null;
  agentPrice?: number | null;
  costPrice?: number | null;
  locationId?: string | null;
  locationLabel?: string;
  batteryHealth?: number | null;
  modelId?: string | null;
  modelName?: string | null;
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
  model: SelectAsyncOption | null;
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
  batteryHealth: number | null;
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

const COLUMN_VISIBILITY_STORAGE_KEY = "inventoryColumnVisibility";
const COLUMN_ORDER_STORAGE_KEY = "inventoryColumnOrder";

const InventoryPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const inventoryService = useInventoryService();
  const productService = useProductService();
  const apiRef = useGridApiRef();
  const fetchProductById = useProductByIdFetcher();
  const fetchProductOptions = useProductSelectOptionsFetcher();
  const fetchLookupById = useLookupByIdFetcher();
  const fetchLookupOptions = useLookupSelectOptionsFetcher();
  const { getLocalDateAndTime } = useUserDateTime();
  const retailPriceLabel = useMemo(
    () => t("retail-price", { defaultValue: "Retail Price" }),
    [t]
  );
  const dealerPriceLabel = useMemo(
    () => t("dealer-price", { defaultValue: "Dealer Price" }),
    [t]
  );
  const agentPriceLabel = useMemo(
    () => t("agent-price", { defaultValue: "Agent Price" }),
    [t]
  );

  const [filters] = useState<InventorySearchFilters>({
    search: "",
    product: null,
    model: null,
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
    batteryHealth: null,
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
  const [pageBlocker, setPageBlocker] = useState(false);
  const [printRequested, setPrintRequested] = useState(false);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const auditRequestRef = useRef<{
    key: string;
    promise: Promise<PagedListDto<InventoryAuditDto>>;
  } | null>(null);
  const pendingLoadsRef = useRef(0);
  const [gridRows, setGridRows] = useState<BalanceRow[]>([]);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(() => {
      if (typeof window === "undefined") return {};
      const stored = window.localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY);
      if (!stored) return {};
      try {
        return JSON.parse(stored) as GridColumnVisibilityModel;
      } catch {
        return {};
      }
    });
  const columnOrderRef = useRef<string[] | null>(null);

  const startLoading = useCallback(() => {
    pendingLoadsRef.current += 1;
    setPageBlocker(true);
  }, []);

  const finishLoading = useCallback(() => {
    pendingLoadsRef.current = Math.max(0, pendingLoadsRef.current - 1);
    if (pendingLoadsRef.current === 0) {
      setPageBlocker(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        COLUMN_VISIBILITY_STORAGE_KEY,
        JSON.stringify(columnVisibilityModel)
      );
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("Failed to persist column visibility", err);
      }
    }
  }, [columnVisibilityModel]);
  const handleColumnOrderChange = useCallback(() => {
    if (typeof window === "undefined" || !apiRef.current) return;
    try {
      const order =
        apiRef.current.exportState?.().columns?.orderedFields ??
        apiRef.current.state.columns?.orderedFields ??
        [];
      columnOrderRef.current = order;
      window.localStorage.setItem(
        COLUMN_ORDER_STORAGE_KEY,
        JSON.stringify(order)
      );
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("Failed to persist column order", err);
      }
    }
  }, [apiRef]);
  const { data: historyLogs = [], isLoading: historyLoading } =
    useInventoryAuditLogQuery(historyProductId);

  const selectedRemarks = useMemo(
    () => parseRemarkSelections(formValues.remark),
    [formValues.remark]
  );

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
          row.locationLabel ??
          productExtras[row.productId]?.locationId ??
          row.locationId ??
          t("no-location")
      ),
    [formatText, productExtras, t]
  );

  const handleInlineRetailPriceChange = useCallback(
    (productId: string, value: string) => {
      const numeric =
        value.trim() === ""
          ? null
          : Number.isNaN(Number(value))
          ? null
          : Number(value);

      setProductExtras((prev) => ({
        ...prev,
        [productId]: {
          ...(prev[productId] ?? {}),
          retailPrice: numeric,
        },
      }));

      inventoryService
        .updateRetailPrice(productId, { retailPrice: numeric })
        .then(() =>
          queryClient.invalidateQueries({
            queryKey: productQueryKeys.byId(productId),
          })
        )
        .catch((err) => {
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.error("Failed to update retail price", err);
          }
        });
    },
    [inventoryService, queryClient]
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

  const sortByName = useCallback(
    (a: InventoryAuditDto, b: InventoryAuditDto) => {
      const labelA = `${(
        a.modelName ??
        a.productCode ??
        ""
      ).trim()}`.toLowerCase();
      const labelB = `${(
        b.modelName ??
        b.productCode ??
        ""
      ).trim()}`.toLowerCase();

      if (labelA === labelB) {
        return (a.productCode ?? "").localeCompare(b.productCode ?? "");
      }

      return labelA.localeCompare(labelB);
    },
    []
  );

  const buildExtras = (product: ProductDetailsDto): ProductExtras => ({
    remark: product.remark ?? "",
    internalRemark: product.internalRemark ?? "",
    retailPrice: product.retailPrice ?? null,
    dealerPrice: product.dealerPrice ?? null,
    agentPrice: product.agentPrice ?? null,
    costPrice: product.costPrice ?? null,
    locationId: product.locationId ?? null,
    batteryHealth: product.batteryHealth ?? null,
    modelId: (product as any).modelId ?? null,
    modelName: (product as any).modelName ?? (product as any).model ?? null,
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

      try {
        const res = await productService.getProductsByIds(missing);
        const items = res.data || [];
        const next = { ...productExtras };

        items.forEach((product) => {
          next[product.productId as string] = buildExtras(product);
        });

        setProductExtras(next);

        await hydrateLocationLabels(
          items
            .map((p) => p.locationId as string | undefined | null)
            .filter(Boolean) as string[]
        );
      } catch (err) {
        console.warn("Failed to bulk load products for balance rows", err);
      }
    },
    [hydrateLocationLabels, productExtras, productService]
  );

  const buildPayload = useCallback(
    (page: number, pageSize: number, searchValue: string) => {
      const searchText = (searchValue ?? filters.search).trim();
      const safePageSize = pageSize > 0 ? pageSize : 100;

      return {
        search: searchText.length > 0 ? searchText : null,
        productId: toGuid(filters.product?.value),
        modelId: toGuid(filters.model?.value),
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
        batteryHealth:
          typeof filters.batteryHealth === "number"
            ? filters.batteryHealth
            : null,
        page: page + 1,
        pageSize: safePageSize,
      };
    },
    [filters, toGuid]
  );

  const fetchAudit = useCallback(
    (page: number, pageSize: number, searchValue: string) => {
      const payload = buildPayload(page, pageSize, searchValue);
      const key = JSON.stringify(payload);

      if (!auditRequestRef.current || auditRequestRef.current.key !== key) {
        const request = inventoryService.searchAudit(payload);
        auditRequestRef.current = {
          key,
          promise: request.finally(() => {
            if (auditRequestRef.current?.key === key) {
              auditRequestRef.current = null;
            }
          }),
        };
      }

      return auditRequestRef.current.promise;
    },
    [buildPayload, inventoryService]
  );

  const loadAllBalances = useCallback(async () => {
    startLoading();
    try {
      const res = await fetchAudit(0, 100000, "");
      const items = res.data || [];
      const sorted = [...items].sort(sortByName);
      const mapped = sorted.map((item, index) => ({
        ...item,
        rowId: index,
      }));
      setGridRows(mapped);
      await hydrateProductExtras(mapped.map((d) => d.productId as string));
    } finally {
      finishLoading();
    }
  }, [
    fetchAudit,
    finishLoading,
    hydrateProductExtras,
    sortByName,
    startLoading,
  ]);

  useEffect(() => {
    loadAllBalances();
  }, [loadAllBalances]);

  const openEdit = async (productId: string) => {
    let extras = productExtras[productId];
    if (
      !extras ||
      extras.dealerPrice === undefined ||
      extras.agentPrice === undefined
    ) {
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
      model: extras.modelName ?? (row as any).modelName ?? null,
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

  const columns: GridColDef<BalanceRow>[] = useMemo(() => {
    const cols: GridColDef<BalanceRow>[] = [
      {
        field: "productCode",
        headerName: t("product-code"),
        flex: 1.1,
        minWidth: 120,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(
            productExtras[row.productId]?.productCode ?? row.productCode
          ),
      },
      {
        field: "model",
        headerName: t("model"),
        flex: 1.2,
        minWidth: 150,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(
            productExtras[row.productId]?.modelName ??
              (row as any).modelName ??
              (row as any).model
          ),
      },
      {
        field: "createdAt",
        headerName: t("created-at", { defaultValue: "Created At" }),
        flex: 1,
        minWidth: 150,
        valueGetter: (_value, row: BalanceRow) => formatDateTime(row.createdAt),
      },
      {
        field: "remark",
        headerName: t("remark"),
        flex: 1.1,
        minWidth: 120,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(productExtras[row.productId]?.remark),
      },
      {
        field: "internalRemark",
        headerName: t("internal-remark"),
        flex: 1.1,
        minWidth: 120,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(productExtras[row.productId]?.internalRemark),
      },
      {
        field: "warehouse",
        headerName: t("warehouse"),
        flex: 1,
        minWidth: 120,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(row.warehouseLabel),
      },
      {
        field: "location",
        headerName: t("location"),
        flex: 1,
        minWidth: 120,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(getLocationDisplay(row)),
      },
      {
        field: "retailPrice",
        headerName: retailPriceLabel,
        width: 100,
        minWidth: 100,
        type: "number",
        renderCell: ({ row }) => {
          const value = productExtras[row.productId]?.retailPrice;
          return (
            <TextField
              size="small"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={value ?? ""}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                handleInlineRetailPriceChange(
                  row.productId as string,
                  e.target.value
                )
              }
              sx={{
                width: "100%",
                "& .MuiInputBase-root": { height: 28 },
                "& .MuiInputBase-input": { py: 0.5 },
              }}
            />
          );
        },
        valueGetter: (_value, row: BalanceRow) =>
          productExtras[row.productId]?.retailPrice ?? null,
      },
      {
        field: "dealerPrice",
        headerName: dealerPriceLabel,
        flex: 1,
        minWidth: 110,
        type: "number",
        valueGetter: (_value, row: BalanceRow) =>
          productExtras[row.productId]?.dealerPrice ?? null,
      },
      {
        field: "agentPrice",
        headerName: agentPriceLabel,
        flex: 1,
        minWidth: 110,
        type: "number",
        valueGetter: (_value, row: BalanceRow) =>
          productExtras[row.productId]?.agentPrice ?? null,
      },
    ];

    if (!isSalesTeamUser) {
      cols.push({
        field: "costPrice",
        headerName: t("cost"),
        flex: 1,
        minWidth: 110,
        type: "number",
        valueGetter: (_value, row: BalanceRow) =>
          productExtras[row.productId]?.costPrice ?? null,
      });
    }

    cols.push(
      {
        field: "batteryHealth",
        headerName: t("battery-health", { defaultValue: "Battery Health" }),
        flex: 1,
        minWidth: 120,
        type: "number",
        valueGetter: (_value, row: BalanceRow) =>
          productExtras[row.productId]?.batteryHealth ??
          row.batteryHealth ??
          null,
        valueFormatter: (value) =>
          value === null || value === undefined ? "-" : `${value}`,
      },
      {
        field: "ageDays",
        headerName: t("stock-age-days", { defaultValue: "Age (days)" }),
        type: "number",
        flex: 0.7,
        minWidth: 90,
        valueGetter: (_value, row: BalanceRow) => row.ageDays ?? null,
      },
      {
        field: "ram",
        headerName: t("ram"),
        flex: 0.8,
        minWidth: 80,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(productExtras[row.productId]?.ram),
      },
      {
        field: "storage",
        headerName: t("storage"),
        flex: 0.8,
        minWidth: 80,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(productExtras[row.productId]?.storage),
      },
      {
        field: "processor",
        headerName: t("processor"),
        flex: 0.8,
        minWidth: 100,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(productExtras[row.productId]?.processor),
      },
      {
        field: "screenSize",
        headerName: t("screen-size"),
        flex: 0.8,
        minWidth: 100,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(productExtras[row.productId]?.screenSize),
      },
      {
        field: "grade",
        headerName: t("grade"),
        flex: 0.7,
        minWidth: 80,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(productExtras[row.productId]?.gradeName),
      },
      {
        field: "brand",
        headerName: t("brand"),
        flex: 0.9,
        minWidth: 100,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(productExtras[row.productId]?.brand),
      },
      {
        field: "category",
        headerName: t("category"),
        flex: 0.9,
        minWidth: 100,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(productExtras[row.productId]?.category),
      },
      {
        field: "serialNumber",
        headerName: t("serial-number", { defaultValue: "Serial Number" }),
        flex: 1,
        minWidth: 140,
        valueGetter: (_value, row: BalanceRow) =>
          formatText(productExtras[row.productId]?.serialNumber),
      },
      {
        field: "actions",
        headerName: "",
        sortable: false,
        filterable: false,
        width: 140,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                openHistory(row.productId as string);
              }}
              aria-label={t("history")}
            >
              <HistoryIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                setActiveBalanceRow(row);
              }}
              aria-label={t("view", { defaultValue: "View" })}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                openEdit(row.productId as string);
              }}
              aria-label={t("edit")}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                printLabel(row);
              }}
              aria-label={t("print")}
            >
              <PrintIcon fontSize="small" />
            </IconButton>
          </Stack>
        ),
      }
    );

    return cols;
  }, [
    agentPriceLabel,
    dealerPriceLabel,
    formatText,
    getLocationDisplay,
    handleInlineRetailPriceChange,
    isSalesTeamUser,
    openEdit,
    openHistory,
    printLabel,
    productExtras,
    retailPriceLabel,
    t,
  ]);

  // Export to Excel function
  const handleExportToExcel = useCallback(() => {
    // Build export data with headers (exclude actions column)
    const exportColumns = columns.filter((col) => col.field !== "actions");
    const headers = exportColumns.map((col) => col.headerName || col.field);

    const data = gridRows.map((row) => {
      const extras = productExtras[row.productId] || {};
      const rowData: Record<string, any> = {};

      exportColumns.forEach((col) => {
        const field = col.field;
        let value: any;

        // Get values based on field - similar to valueGetter logic
        switch (field) {
          case "productCode":
            value = extras.productCode ?? row.productCode;
            break;
          case "model":
            value =
              extras.modelName ?? (row as any).modelName ?? (row as any).model;
            break;
          case "createdAt":
            value = row.createdAt ? new Date(row.createdAt) : "";
            break;
          case "remark":
            value = extras.remark;
            break;
          case "internalRemark":
            value = extras.internalRemark;
            break;
          case "warehouse":
            value = row.warehouseLabel;
            break;
          case "location":
            value =
              extras.locationLabel ??
              row.locationLabel ??
              extras.locationId ??
              row.locationId;
            break;
          case "retailPrice":
            value = extras.retailPrice ?? null;
            break;
          case "dealerPrice":
            value = extras.dealerPrice ?? null;
            break;
          case "agentPrice":
            value = extras.agentPrice ?? null;
            break;
          case "costPrice":
            value = extras.costPrice ?? null;
            break;
          case "batteryHealth":
            value = extras.batteryHealth ?? row.batteryHealth ?? null;
            break;
          case "ageDays":
            value = row.ageDays ?? null;
            break;
          case "ram":
            value = extras.ram;
            break;
          case "storage":
            value = extras.storage;
            break;
          case "processor":
            value = extras.processor;
            break;
          case "screenSize":
            value = extras.screenSize;
            break;
          case "grade":
            value = extras.gradeName;
            break;
          case "brand":
            value = extras.brand;
            break;
          case "category":
            value = extras.category;
            break;
          case "serialNumber":
            value = extras.serialNumber;
            break;
          default:
            value = (row as any)[field];
        }

        rowData[col.headerName || field] = value ?? "";
      });
      return rowData;
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");

    // Generate filename with date
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `inventory_${dateStr}.xlsx`;

    // Download
    XLSX.writeFile(wb, filename);
  }, [columns, gridRows, productExtras]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !apiRef.current ||
      columns.length === 0
    )
      return;

    // Load column order once on mount
    if (columnOrderRef.current === null) {
      const stored = window.localStorage.getItem(COLUMN_ORDER_STORAGE_KEY);
      if (stored) {
        try {
          columnOrderRef.current = JSON.parse(stored) as string[];
        } catch {
          columnOrderRef.current = [];
        }
      } else {
        columnOrderRef.current = [];
      }
    }

    const order = columnOrderRef.current;
    if (!order || order.length === 0) return;

    apiRef.current.restoreState({
      columns: {
        orderedFields: order,
      },
    });
  }, [apiRef, columns]);

  const onSave = async () => {
    if (!editingProductId) return;
    const payload: UpdateInventoryBalanceDto = {
      remark: formValues.remark ?? null,
      internalRemark: formValues.internalRemark ?? null,
      agentPrice: formValues.agentPrice ?? null,
      dealerPrice: formValues.dealerPrice ?? null,
      retailPrice: formValues.retailPrice ?? null,
      ...(isSalesTeamUser ? {} : { costPrice: formValues.costPrice ?? null }),
      locationId: formValues.locationId ?? null,
      batteryHealth: formValues.batteryHealth ?? null,
    };
    setSaving(true);
    try {
      await inventoryService.updateBalance(editingProductId, payload);
      // Invalidate the cache to ensure fresh data is fetched
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.byId(editingProductId),
      });
      // Fetch the updated product to get fresh data
      const updatedProduct = await fetchProductById(editingProductId);
      const freshExtras = buildExtras(updatedProduct);
      setProductExtras((prev) => ({
        ...prev,
        [editingProductId]: freshExtras,
      }));
      // Hydrate location label if needed
      if (freshExtras.locationId) {
        await hydrateLocationLabels([freshExtras.locationId]);
      }
      closeDialog();
      await loadAllBalances();
    } catch (err) {
      console.error("Failed to update inventory balance row", err);
      setSaving(false);
    }
  };

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
        value: formatText(
          extras.modelName ?? (activeBalanceRow as any).modelName
        ),
      },
      {
        label: t("created-at", { defaultValue: "Created At" }),
        value: formatDateTime(activeBalanceRow.createdAt),
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
        label: retailPriceLabel,
        value: formatNumber(extras.retailPrice),
      },
      {
        label: dealerPriceLabel,
        value: formatNumber(extras.dealerPrice),
      },
      {
        label: agentPriceLabel,
        value: formatNumber(extras.agentPrice),
      },
      ...(!isSalesTeamUser
        ? [
            {
              label: t("cost"),
              value: formatNumber(extras.costPrice ?? 0),
            },
          ]
        : []),
      {
        label: t("Battery", { defaultValue: "Battery" }),
        value:
          extras.batteryHealth != null
            ? formatNumber(extras.batteryHealth)
            : "-",
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
    isSalesTeamUser,
    agentPriceLabel,
    dealerPriceLabel,
    retailPriceLabel,
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
        showSearch={false}
      >
        <PbCard>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportToExcel}
              disabled={pageBlocker || gridRows.length === 0}
            >
              {t("export-to-excel", { defaultValue: "Export to Excel" })}
            </Button>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: { xs: 500, sm: 600, md: 700 },
              overflowX: "auto",
            }}
          >
            <DataGrid
              apiRef={apiRef}
              rows={gridRows.map((r) => ({
                ...r,
                id: r.productId ?? r.rowId,
              }))}
              columns={columns}
              getRowId={(row) =>
                (row as BalanceRow).productId ?? (row as any).id
              }
              loading={pageBlocker}
              disableRowSelectionOnClick
              columnVisibilityModel={columnVisibilityModel}
              onColumnVisibilityModelChange={setColumnVisibilityModel}
              onColumnOrderChange={handleColumnOrderChange}
              sortingMode="client"
              filterMode="client"
              disableColumnMenu={false}
              initialState={{
                sorting: { sortModel: [{ field: "productCode", sort: "asc" }] },
              }}
              density="compact"
              rowHeight={48}
              disableAutosize
              sx={{
                fontSize: 12,
                "& .MuiDataGrid-cell": {
                  alignItems: "flex-start",
                  py: 0.5,
                },
                "& .MuiDataGrid-columnHeaders": { lineHeight: "35px" },
              }}
            />
          </Box>
        </PbCard>
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
              allowCustom
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
            <TextField
              label={t("battery-health", {
                defaultValue: "Battery Health (%)",
              })}
              size="small"
              type="number"
              inputProps={{ min: 0, max: 100, step: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              value={formValues.batteryHealth ?? ""}
              onChange={(e) =>
                updateField(
                  "batteryHealth",
                  e.target.value === ""
                    ? null
                    : Math.max(
                        0,
                        Math.min(100, Number.parseFloat(e.target.value) || 0)
                      )
                )
              }
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }} />
              <Box sx={{ flex: 1 }} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label={retailPriceLabel}
                size="small"
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
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
                label={dealerPriceLabel}
                size="small"
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
                value={formValues.dealerPrice ?? ""}
                onChange={(e) =>
                  updateField(
                    "dealerPrice",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                fullWidth
              />
              <TextField
                label={agentPriceLabel}
                size="small"
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
                value={formValues.agentPrice ?? ""}
                onChange={(e) =>
                  updateField(
                    "agentPrice",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                fullWidth
              />
              {!isSalesTeamUser && (
                <TextField
                  label={t("cost")}
                  size="small"
                  type="number"
                  inputProps={{ min: 0, step: "0.01" }}
                  value={formValues.costPrice ?? ""}
                  onChange={(e) =>
                    updateField(
                      "costPrice",
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  fullWidth
                />
              )}
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
              onSelectionChange={(option) => {
                const nextId = option ? (option.value as string) : null;
                updateField("locationId", nextId);

                if (editingProductId) {
                  setProductExtras((prev) => ({
                    ...prev,
                    [editingProductId]: {
                      ...(prev[editingProductId] ?? {}),
                      locationId: nextId,
                      locationLabel: option?.label ?? undefined,
                    },
                  }));
                }
              }}
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
          {!historyLoading &&
            historyLogs.filter((log) => {
              if (!isSalesTeamUser) return true;
              const property = (log.propertyName ?? "")
                .replace(/\s+/g, "")
                .toLowerCase();
              return property !== "cost" && property !== "costprice";
            }).length === 0 && (
              <Typography variant="body2" color="textSecondary">
                {t("no-history", { defaultValue: "No history available." })}
              </Typography>
            )}
          {!historyLoading &&
            historyLogs
              .filter((log) => {
                if (!isSalesTeamUser) return true;
                const property = (log.propertyName ?? "")
                  .replace(/\s+/g, "")
                  .toLowerCase();
                return property !== "cost" && property !== "costprice";
              })
              .map((log) => (
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
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mt={0.5}
                  >
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
                    <UserName userId={log.changedBy} placeholder="-" />
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
