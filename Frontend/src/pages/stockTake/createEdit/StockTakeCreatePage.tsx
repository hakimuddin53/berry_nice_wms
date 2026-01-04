import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LookupAutocomplete from "components/platbricks/shared/LookupAutocomplete";
import Page from "components/platbricks/shared/Page";
import ProductCodeScanStockTake from "components/platbricks/shared/ProductCodeScanStockTake";
import { useFormik } from "formik";
import { InventorySummaryRowDto } from "interfaces/v12/inventory/inventorySummaryDto";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import {
  StockTakeCreateDto,
  StockTakeCreateItemDto,
} from "interfaces/v12/stockTake/stockTakeCreateDto";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useInventoryService } from "services/InventoryService";
import { useProductService } from "services/ProductService";
import { useStockTakeService } from "services/StockTakeService";
import * as Yup from "yup";

const validationSchema = Yup.object({
  warehouseId: Yup.string().required("Warehouse is required"),
  items: Yup.array()
    .of(
      Yup.object({
        productId: Yup.string().nullable(),
        scannedBarcode: Yup.string().nullable(),
        countedQuantity: Yup.number()
          .min(1, "Quantity must be at least 1")
          .required("Quantity is required"),
        remark: Yup.string().nullable(),
      }).test(
        "product-or-barcode",
        "Product or scanned barcode is required",
        (value) => !!(value?.productId || value?.scannedBarcode)
      )
    )
    .min(1, "At least one item is required"),
});

const StockTakeCreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stockTakeService = useStockTakeService();
  const inventoryService = useInventoryService();
  const productService = useProductService();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannedProducts, setScannedProducts] = useState<
    Record<
      string,
      InventorySummaryRowDto & {
        count: number;
        lastScanned: number;
        systemQty?: number;
      }
    >
  >({});
  const [missingBarcodes, setMissingBarcodes] = useState<
    Record<
      string,
      { code: string; count: number; lastScanned: number; reason?: string }
    >
  >({});

  const formik = useFormik<StockTakeCreateDto>({
    initialValues: {
      warehouseId: "",
      items: [] as StockTakeCreateItemDto[],
      remark: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await stockTakeService.create(values);
        navigate("/stock-take");
      } catch (err: any) {
        const message =
          err?.response?.data?.message ??
          t("common:request-failed", { defaultValue: "Request failed" });
        setErrors({ warehouseId: message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const unwrapInventoryResults = (result: any): InventorySummaryRowDto[] => {
    if (!result) return [];
    if (Array.isArray(result)) return result;
    if (Array.isArray(result.data)) return result.data;
    if (Array.isArray(result.data?.data)) return result.data.data;
    return [];
  };

  const syncFormikItems = useCallback(
    (
      items: Record<
        string,
        InventorySummaryRowDto & { count: number; systemQty?: number }
      >,
      missing: Record<string, { code: string; count: number; reason?: string }>
    ) => {
      const formItems: StockTakeCreateItemDto[] = [
        ...Object.values(items).map((item) => ({
          productId: item.productId,
          scannedBarcode: null,
          countedQuantity: item.count,
          systemQuantity: item.systemQty ?? item.availableQuantity ?? 0,
          differenceQuantity:
            item.count - (item.systemQty ?? item.availableQuantity ?? 0),
        })),
        ...Object.values(missing).map((item) => ({
          productId: null,
          scannedBarcode: item.code,
          countedQuantity: item.count,
        })),
      ];
      formik.setFieldValue("items", formItems);
    },
    [formik]
  );

  const handleProductResolved = useCallback(
    async (code: string) => {
      setScanError(null);
      try {
        const response = await inventoryService.searchSummary({
          search: code,
          page: 1,
          pageSize: 1,
          warehouseId: (formik.values.warehouseId as any) || null,
        });
        const rows = unwrapInventoryResults(response);
        if (rows.length > 0) {
          const hit = rows[0];
          const systemQty = hit.availableQuantity ?? 0;
          setScannedProducts((prev) => {
            const next = {
              ...prev,
              [hit.productId]: {
                ...hit,
                count: (prev[hit.productId]?.count ?? 0) + 1,
                systemQty,
                lastScanned: Date.now(),
              },
            };
            syncFormikItems(next, missingBarcodes);
            return next;
          });
        } else {
          // Check if product exists in another warehouse
          const productOptions = await productService.getSelectOptions(
            code,
            1,
            1
          );
          const existsElsewhere =
            Array.isArray(productOptions) && productOptions.length > 0;
          setMissingBarcodes((prev) => {
            const next = {
              ...prev,
              [code]: {
                code,
                count: (prev[code]?.count ?? 0) + 1,
                lastScanned: Date.now(),
                reason: existsElsewhere ? "other-warehouse" : "not-found",
              },
            };
            syncFormikItems(scannedProducts, next);
            return next;
          });
        }
      } catch (e) {
        setScanError(
          t("common:request-failed", { defaultValue: "Request failed" })
        );
      }
    },
    [
      inventoryService,
      missingBarcodes,
      scannedProducts,
      syncFormikItems,
      productService,
      t,
      formik.values.warehouseId,
    ]
  );

  const removeScannedProduct = (productId: string) => {
    setScannedProducts((prev) => {
      const next = { ...prev };
      delete next[productId];
      syncFormikItems(next, missingBarcodes);
      return next;
    });
  };

  const inventoryList = useMemo(
    () =>
      Object.values(scannedProducts).sort(
        (a, b) => b.lastScanned - a.lastScanned
      ),
    [scannedProducts]
  );

  const missingList = useMemo(
    () =>
      Object.values(missingBarcodes).sort(
        (a, b) => b.lastScanned - a.lastScanned
      ),
    [missingBarcodes]
  );

  return (
    <Page
      title={t("stock-take", { defaultValue: "Stock Take" })}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        {
          label: t("stock-take", { defaultValue: "Stock Take" }),
          to: "/stock-take",
        },
        { label: t("new-stock-take", { defaultValue: "New Stock Take" }) },
      ]}
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t("common:details")}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <LookupAutocomplete
                  groupKey={LookupGroupKey.Warehouse}
                  name="warehouseId"
                  value={formik.values.warehouseId}
                  onChange={(value) =>
                    formik.setFieldValue("warehouseId", value || "")
                  }
                  onBlur={() => formik.setFieldTouched("warehouseId")}
                  error={
                    formik.touched.warehouseId &&
                    Boolean(formik.errors.warehouseId)
                  }
                  helperText={
                    formik.touched.warehouseId && formik.errors.warehouseId
                  }
                  label={t("warehouse")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="remark"
                  label={t("remark")}
                  size="small"
                  value={formik.values.remark ?? ""}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </Paper>

          <Card>
            <CardHeader
              title={t("scan-items", { defaultValue: "Scan items" })}
              subheader={t("scan-items-to-verify-inventory", {
                defaultValue:
                  "Scan barcodes; each scan adds 1 to the counted quantity.",
              })}
            />
            <CardContent>
              <Stack spacing={2}>
                <ProductCodeScanStockTake
                  label={t("scan-barcode", { defaultValue: "Scan barcode" })}
                  warehouseId={formik.values.warehouseId}
                  onResolved={handleProductResolved}
                  onMissing={(code, existsElsewhere) => {
                    setMissingBarcodes((prev) => {
                      const next = {
                        ...prev,
                        [code]: {
                          code,
                          count: (prev[code]?.count ?? 0) + 1,
                          lastScanned: Date.now(),
                          reason: existsElsewhere
                            ? "other-warehouse"
                            : "not-found",
                        },
                      };
                      syncFormikItems(scannedProducts, next);
                      return next;
                    });
                  }}
                  helperText={t("hit-enter-to-add", {
                    defaultValue: "Press Enter after each scan.",
                  })}
                />
                {scanError && (
                  <Typography color="error" variant="body2">
                    {scanError}
                  </Typography>
                )}
                <Divider />
                <Stack
                  direction={isMobile ? "column" : "row"}
                  spacing={3}
                  alignItems="stretch"
                >
                  <Box flex={1}>
                    <Typography variant="subtitle1" gutterBottom>
                      {t("items", { defaultValue: "Items" })}
                    </Typography>
                    {inventoryList.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        {t("start-scanning-to-see-inventory", {
                          defaultValue: "Start scanning to add items.",
                        })}
                      </Typography>
                    ) : (
                      <List dense>
                        {inventoryList.map((item) => (
                          <ListItem
                            key={item.productId}
                            divider
                            secondaryAction={
                              <IconButton
                                edge="end"
                                aria-label={t("remove")}
                                onClick={() =>
                                  removeScannedProduct(item.productId)
                                }
                              >
                                <Delete />
                              </IconButton>
                            }
                          >
                            <ListItemText
                              primary={item.productCode || item.productId}
                              secondary={item.model}
                            />
                            <Stack direction="row" spacing={1}>
                              <Chip
                                label={`${t("counted-quantity", {
                                  defaultValue: "Counted Qty",
                                })}: ${item.count}`}
                                color="primary"
                                size="small"
                              />
                              <Chip
                                label={`${t("system-quantity", {
                                  defaultValue: "System",
                                })}: ${
                                  item.systemQty ?? item.availableQuantity ?? 0
                                }`}
                                variant="outlined"
                                size="small"
                              />
                              <Chip
                                label={`${t("difference", {
                                  defaultValue: "Diff",
                                })}: ${
                                  item.count -
                                  (item.systemQty ??
                                    item.availableQuantity ??
                                    0)
                                }`}
                                variant="outlined"
                                size="small"
                              />
                            </Stack>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                  <Box flex={1}>
                    <Typography variant="subtitle1" gutterBottom>
                      {t("not-in-inventory", {
                        defaultValue: "Not in inventory",
                      })}
                    </Typography>
                    {missingList.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        {t("no-missing-scans", {
                          defaultValue: "No missing barcodes yet.",
                        })}
                      </Typography>
                    ) : (
                      <List dense>
                        {missingList.map((item) => (
                          <ListItem key={item.code} divider>
                            <ListItemText
                              primary={item.code}
                              secondary={
                                item.reason === "other-warehouse"
                                  ? t("not-in-selected-warehouse", {
                                      defaultValue:
                                        "Not in selected warehouse inventory",
                                    })
                                  : t("flagged-not-in-inventory", {
                                      defaultValue:
                                        "Flagged as not in inventory",
                                    })
                              }
                            />
                            <Chip
                              label={`${t("scanned", {
                                defaultValue: "Scanned",
                              })}: ${item.count}`}
                              color="warning"
                              size="small"
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => navigate("/stock-take")}>
              {t("common:cancel")}
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {t("common:save")}
            </Button>
          </Box>
        </Stack>
      </form>
    </Page>
  );
};

export default StockTakeCreatePage;
