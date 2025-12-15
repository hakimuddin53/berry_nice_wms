import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SelectAsync from "components/platbricks/shared/SelectAsync";
import { DataTable } from "components/platbricks/shared";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import { InventoryAuditDto } from "interfaces/v12/inventory/inventoryAuditDto";
import { UpdateInventoryBalanceDto } from "interfaces/v12/inventory/updateInventoryBalanceDto";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { ProductDetailsDto } from "interfaces/v12/product/productDetails/productDetailsDto";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInventoryService } from "services/InventoryService";
import { useLookupService } from "services/LookupService";
import { useProductService } from "services/ProductService";

type BalanceRow = InventoryAuditDto & { rowId: number };

type ProductExtras = {
  remark?: string | null;
  internalRemark?: string | null;
  agentPrice?: number | null;
  dealerPrice?: number | null;
  retailPrice?: number | null;
  costPrice?: number | null;
  locationId?: string | null;
  locationLabel?: string;
};

const InventoryBalancePage = () => {
  const { t } = useTranslation();
  const inventoryService = useInventoryService();
  const productService = useProductService();
  const lookupService = useLookupService();

  const [search, setSearch] = useState("");
  const [productExtras, setProductExtras] = useState<
    Record<string, ProductExtras>
  >({});
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ProductExtras>({});
  const [saving, setSaving] = useState(false);

  const formatNumber = (value?: number | null) =>
    value === null || value === undefined ? "-" : value.toString();

  const headerCells: DataTableHeaderCell<BalanceRow>[] = useMemo(
    () => [
      { id: "productCode", label: t("product-code") },
      { id: "model", label: t("model"), render: (row) => row.model ?? "-" },
      {
        id: "warehouseLabel",
        label: t("warehouse"),
        render: (row) => row.warehouseLabel || "-",
      },
      {
        id: "newBalance",
        label: t("new-balance"),
        align: "right",
        render: (row) => formatNumber(row.newBalance),
      },
      {
        id: "locationId",
        label: t("location"),
        render: (row) =>
          productExtras[row.productId]?.locationLabel ??
          productExtras[row.productId]?.locationId ??
          t("no-location"),
      },
      {
        id: "remark",
        label: t("remark"),
        render: (row) => productExtras[row.productId]?.remark || "-",
      },
      {
        id: "internalRemark",
        label: t("internal-remark"),
        render: (row) => productExtras[row.productId]?.internalRemark || "-",
      },
      {
        id: "agentPrice",
        label: t("agent"),
        align: "right",
        render: (row) => formatNumber(productExtras[row.productId]?.agentPrice),
      },
      {
        id: "dealerPrice",
        label: t("dealer"),
        align: "right",
        render: (row) =>
          formatNumber(productExtras[row.productId]?.dealerPrice),
      },
      {
        id: "retailPrice",
        label: t("retail"),
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
          <Button
            size="small"
            variant="outlined"
            onClick={() => openEdit(row.productId as string)}
          >
            {t("edit")}
          </Button>
        ),
      },
    ],
    [t, productExtras]
  );

  const dedupeLatestBalances = (items: InventoryAuditDto[]) => {
    const map = new Map<string, InventoryAuditDto>();
    items
      .filter((i) => (i.newBalance ?? 0) > 0)
      .forEach((item) => {
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
    agentPrice: product.agentPrice ?? null,
    dealerPrice: product.dealerPrice ?? null,
    retailPrice: product.retailPrice ?? null,
    costPrice: product.costPrice ?? null,
    locationId: product.locationId ?? null,
  });

  const hydrateProductExtras = useCallback(
    async (productIds: string[]) => {
      const missing = productIds.filter((id) => !productExtras[id]);
      if (missing.length === 0) {
        return;
      }

      const results = await Promise.all(
        missing.map(async (id) => {
          try {
            const product = await productService.getProductById(id);
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
    [productExtras, productService]
  );

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
            const lookup = await lookupService.getById(id);
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
    [lookupService, productExtras]
  );

  const buildPayload = useCallback(
    (page: number, pageSize: number, searchValue: string) => ({
      search: searchValue ?? search,
      page: page + 1,
      pageSize,
    }),
    [search]
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
    updateDatatableControls({ searchValue: search, page: 0 });
    reloadData(true);
  };

  const openEdit = async (productId: string) => {
    let extras = productExtras[productId];
    if (!extras) {
      try {
        const product = await productService.getProductById(productId);
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

  const updateField = (
    field: keyof ProductExtras,
    value: string | number | null
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value as any }));
  };

  const onSave = async () => {
    if (!editingProductId) return;
    const payload: UpdateInventoryBalanceDto = {
      remark: formValues.remark ?? null,
      internalRemark: formValues.internalRemark ?? null,
      agentPrice: formValues.agentPrice ?? null,
      dealerPrice: formValues.dealerPrice ?? null,
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

  return (
    <>
      <Page
        title={t("inventory-balance")}
        breadcrumbs={[
          { label: t("common:dashboard"), to: "/" },
          { label: t("inventory") },
          { label: t("inventory-balance") },
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
          title={t("inventory-balance")}
          tableKey="InventoryBalancePage"
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
            <TextField
              label={t("remark")}
              value={formValues.remark ?? ""}
              onChange={(e) => updateField("remark", e.target.value)}
              multiline
              minRows={2}
            />
            <TextField
              label={t("internal-remark")}
              value={formValues.internalRemark ?? ""}
              onChange={(e) => updateField("internalRemark", e.target.value)}
              multiline
              minRows={2}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label={t("agent")}
                type="number"
                value={formValues.agentPrice ?? ""}
                onChange={(e) =>
                  updateField(
                    "agentPrice",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                fullWidth
              />
              <TextField
                label={t("dealer")}
                type="number"
                value={formValues.dealerPrice ?? ""}
                onChange={(e) =>
                  updateField(
                    "dealerPrice",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                fullWidth
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label={t("retail")}
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
              label={t("location")}
              placeholder={t("location")}
              loadOptions={(label, page) =>
                lookupService.getSelectOptions(
                  LookupGroupKey.Location,
                  label ?? "",
                  page,
                  10,
                  formValues.locationId ? [formValues.locationId] : undefined
                )
              }
              value={
                formValues.locationId
                  ? {
                      label:
                        productExtras[editingProductId ?? ""]?.locationLabel ??
                        t("location"),
                      value: formValues.locationId,
                    }
                  : null
              }
              onChange={(option) =>
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
    </>
  );
};

export default InventoryBalancePage;
