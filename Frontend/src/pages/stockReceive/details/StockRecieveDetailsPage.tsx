import {
  Box,
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import UserName from "components/platbricks/entities/UserName";
import {
  DataTable,
  EasyCopy,
  KeyValueList,
  KeyValuePair,
  Page,
  PbCard,
} from "components/platbricks/shared";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { LookupGroupKey } from "interfaces/v12/lookup/lookup";
import { StockRecieveDetailsDto } from "interfaces/v12/StockRecieve/StockRecieveDetails/StockRecieveDetailsDto";
import { StockRecieveItemDetailsDto } from "interfaces/v12/StockRecieve/StockRecieveDetails/StockRecieveItemDetailsDto";

import { useDatatableControls } from "hooks/useDatatableControls";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useLookupService } from "services/LookupService";
import { useStockRecieveService } from "services/StockRecieveService";
const GUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const isGuidString = (value?: any) =>
  typeof value === "string" && GUID_REGEX.test(value);

function StockRecieveDetailsPage() {
  const { t } = useTranslation("common");
  const { id } = useParams();

  const StockRecieveService = useStockRecieveService();
  const lookupService = useLookupService();
  const [StockRecieve, setStockRecieve] =
    useState<StockRecieveDetailsDto | null>(null);
  const [activeItem, setActiveItem] =
    useState<StockRecieveItemDetailsDto | null>(null);
  const [locationLabels, setLocationLabels] = useState<Record<string, string>>(
    {}
  );
  const [lookupLabels, setLookupLabels] = useState<Record<string, string>>({});
  const {
    updateDatatableControls: updateStockRecieveItemsTableControls,
    tableProps: StockRecieveItemsTableProps,
  } = useDatatableControls<StockRecieveItemDetailsDto>({
    initialData: [],
  });

  const getLocationLabel = useCallback(
    (item: StockRecieveItemDetailsDto) =>
      item.locationName ||
      item.locationLabel ||
      (item.locationId
        ? locationLabels[item.locationId as unknown as string]
        : undefined) ||
      (item.locationId as unknown as string) ||
      "-",
    [locationLabels]
  );

  const formatText = useCallback(
    (value?: string | number | null) =>
      value === null || value === undefined || value === ""
        ? "-"
        : String(value),
    []
  );

  const formatPrice = useCallback(
    (value?: number | null) =>
      value === null || value === undefined ? "-" : value.toFixed(2),
    []
  );

  const formatLookup = useCallback(
    (name?: string | null, id?: string | number | null) => {
      const key = id ? String(id) : "";
      const resolved = name ?? (key ? lookupLabels[key] : undefined);
      return formatText(resolved ?? (key || ""));
    },
    [formatText, lookupLabels]
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

  const StockRecieveItemHeaders = useMemo<
    DataTableHeaderCell<StockRecieveItemDetailsDto>[]
  >(
    () => [
      {
        id: "productCode",
        label: t("product-code"),
        render: (item) => formatText(item.productCode),
      },
      {
        id: "model",
        label: t("model"),
        render: (item) =>
          formatLookup(
            item.modelName ?? null,
            item.modelId as unknown as string
          ),
      },
      {
        id: "batteryHealth",
        label: t("battery-health", { defaultValue: "Battery Health (%)" }),
        render: (item) =>
          item.batteryHealth != null ? `${item.batteryHealth}%` : "-",
      },
      {
        id: "location",
        label: t("location"),
        render: (item) => getLocationLabel(item),
      },
      {
        id: "receiveQuantity",
        label: t("quantity"),
        render: (item) => formatText(item.receiveQuantity),
      },
      {
        id: "cost",
        label: t("cost"),
        render: (item) => formatPrice(item.cost),
      },
    ],
    [formatPrice, formatText, getLocationLabel, t]
  );

  const stockRecieveItemActions = useMemo(
    () => [
      {
        render: (item: StockRecieveItemDetailsDto) => (
          <Button
            size="small"
            variant="outlined"
            onClick={(event) => {
              event.stopPropagation();
              setActiveItem(item);
            }}
          >
            {t("view", { defaultValue: "View" })}
          </Button>
        ),
      },
    ],
    [t]
  );

  const detailRows = useMemo(() => {
    if (!activeItem) {
      return [];
    }

    return [
      { label: t("product-code"), value: formatText(activeItem.productCode) },
      {
        label: t("product-name", { defaultValue: "Product Name" }),
        value: formatText(activeItem.productName),
      },
      {
        label: t("model"),
        value: formatLookup(
          activeItem.modelName ?? null,
          activeItem.modelId as unknown as string
        ),
      },
      {
        label: t("imei", { defaultValue: "IMEI/Serial Number" }),
        value: formatText(activeItem.serialNumber),
      },
      {
        label: t("category"),
        value: formatLookup(
          undefined,
          activeItem.categoryId as unknown as string
        ),
      },
      {
        label: t("brand"),
        value: formatLookup(undefined, activeItem.brandId as unknown as string),
      },
      {
        label: t("colour"),
        value: formatLookup(undefined, activeItem.colorId as unknown as string),
      },
      {
        label: t("storage"),
        value: formatLookup(
          undefined,
          activeItem.storageId as unknown as string
        ),
      },
      {
        label: t("ram"),
        value: formatLookup(undefined, activeItem.ramId as unknown as string),
      },
      {
        label: t("processor"),
        value: formatLookup(
          undefined,
          activeItem.processorId as unknown as string
        ),
      },
      {
        label: t("screen-size"),
        value: formatLookup(
          undefined,
          activeItem.screenSizeId as unknown as string
        ),
      },
      {
        label: t("grade"),
        value: formatLookup(
          activeItem.gradeName ?? null,
          activeItem.gradeId as unknown as string
        ),
      },
      {
        label: t("region"),
        value: formatLookup(
          activeItem.regionName ?? null,
          activeItem.regionId as unknown as string
        ),
      },
      {
        label: t("new-or-used"),
        value: formatLookup(
          activeItem.newOrUsedName ?? null,
          activeItem.newOrUsedId as unknown as string
        ),
      },
      {
        label: t("battery-health", { defaultValue: "Battery Health (%)" }),
        value:
          activeItem.batteryHealth != null
            ? `${activeItem.batteryHealth}%`
            : formatText(activeItem.batteryHealth),
      },
      { label: t("location"), value: getLocationLabel(activeItem) },
      { label: t("quantity"), value: formatText(activeItem.receiveQuantity) },
      { label: t("cost"), value: formatPrice(activeItem.cost) },
      {
        label: t("retail-selling-price"),
        value: formatPrice(activeItem.retailSellingPrice),
      },
      {
        label: t("dealer-selling-price"),
        value: formatPrice(activeItem.dealerSellingPrice),
      },
      {
        label: t("agent-selling-price"),
        value: formatPrice(activeItem.agentSellingPrice),
      },
      { label: t("remark"), value: formatText(activeItem.remark) },
      {
        label: t("internal-remark"),
        value: formatText(activeItem.internalRemark),
      },
    ];
  }, [activeItem, formatLookup, formatPrice, formatText, getLocationLabel, t]);

  const loadStockRecieve = useCallback(() => {
    if (id) {
      StockRecieveService.getStockRecieveById(id)
        .then((StockRecieve) => setStockRecieve(StockRecieve))
        .catch((err) => {});
    }
  }, [StockRecieveService, id]);

  useEffect(() => {
    loadStockRecieve();
  }, [loadStockRecieve]);

  useEffect(() => {
    let isActive = true;

    const fetchMissingLabels = async () => {
      if (!StockRecieve?.stockRecieveItems?.length) return;

      const missingLocationIds = Array.from(
        new Set(
          StockRecieve.stockRecieveItems
            .filter(
              (item) =>
                item.locationId &&
                !locationLabels[item.locationId as unknown as string] &&
                !item.locationName &&
                !item.locationLabel
            )
            .map((item) => item.locationId as unknown as string)
        )
      );

      if (missingLocationIds.length > 0) {
        try {
          const options =
            (await lookupService.getSelectOptions(
              LookupGroupKey.Location,
              "",
              1,
              Math.max(missingLocationIds.length, 10),
              missingLocationIds
            )) ?? [];
          const entries = options
            .filter((opt) => opt.value)
            .map((opt) => [String(opt.value), opt.label ?? String(opt.value)]);

          if (isActive && entries.length > 0) {
            setLocationLabels((prev) => ({
              ...prev,
              ...Object.fromEntries(entries),
            }));
          }
        } catch (err) {
          // ignore
        }
      }

      const stockItems = StockRecieve.stockRecieveItems;
      const lookupGroups = [
        {
          groupKey: LookupGroupKey.ProductCategory,
          ids: stockItems.map((item) => item.categoryId as unknown as string),
        },
        {
          groupKey: LookupGroupKey.Brand,
          ids: stockItems
            .map((item) => item.brandId as unknown as string)
            .filter(Boolean),
        },
        {
          groupKey: LookupGroupKey.Color,
          ids: stockItems
            .map((item) => item.colorId as unknown as string)
            .filter(Boolean),
        },
        {
          groupKey: LookupGroupKey.Storage,
          ids: stockItems
            .map((item) => item.storageId as unknown as string)
            .filter(Boolean),
        },
        {
          groupKey: LookupGroupKey.Ram,
          ids: stockItems
            .map((item) => item.ramId as unknown as string)
            .filter(Boolean),
        },
        {
          groupKey: LookupGroupKey.Processor,
          ids: stockItems
            .map((item) => item.processorId as unknown as string)
            .filter(Boolean),
        },
        {
          groupKey: LookupGroupKey.ScreenSize,
          ids: stockItems
            .map((item) => item.screenSizeId as unknown as string)
            .filter(Boolean),
        },
        {
          groupKey: LookupGroupKey.Grade,
          ids: stockItems
            .map((item) => item.gradeId as unknown as string)
            .filter(Boolean),
        },
        {
          groupKey: LookupGroupKey.Region,
          ids: stockItems
            .map((item) => item.regionId as unknown as string)
            .filter(Boolean),
        },
        {
          groupKey: LookupGroupKey.NewOrUsed,
          ids: stockItems
            .map((item) => item.newOrUsedId as unknown as string)
            .filter(Boolean),
        },
      ];

      const lookupFetches = lookupGroups.map(async ({ groupKey, ids }) => {
        const uniqueIds = Array.from(
          new Set(ids.filter((id) => id && !lookupLabels[id]))
        );
        if (uniqueIds.length === 0) return;

        try {
          const options =
            (await lookupService.getSelectOptions(
              groupKey,
              "",
              1,
              Math.max(uniqueIds.length, 10),
              uniqueIds
            )) ?? [];
          const entries = options
            .filter((opt) => opt.value)
            .map((opt) => [String(opt.value), opt.label ?? String(opt.value)]);

          if (isActive && entries.length > 0) {
            setLookupLabels((prev) => ({
              ...prev,
              ...Object.fromEntries(entries),
            }));
          }
        } catch (err) {
          // ignore
        }
      });

      await Promise.all(lookupFetches);
    };

    fetchMissingLabels();

    return () => {
      isActive = false;
    };
  }, [
    StockRecieve?.stockRecieveItems,
    lookupLabels,
    lookupService,
    locationLabels,
  ]);

  useEffect(() => {
    if (StockRecieve?.stockRecieveItems) {
      updateStockRecieveItemsTableControls({
        data: StockRecieve.stockRecieveItems,
      });
    }
  }, [StockRecieve?.stockRecieveItems, updateStockRecieveItemsTableControls]);

  if (!StockRecieve) {
    return (
      <Page title={t("stock-receive")} breadcrumbs={[]}>
        <Typography>{t("loading")}</Typography>
      </Page>
    );
  }

  return (
    <Page
      title={t("stock-receive")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("stock-receive"), to: "/stock-receive" },
        { label: StockRecieve.number },
      ]}
      actions={[{ title: t("edit"), icon: "Edit", to: "edit" }]}
      hasSingleActionButton
    >
      <PbCard>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <KeyValueList>
                <KeyValuePair label={t("number")}>
                  <EasyCopy clipboard={StockRecieve.number}>
                    {StockRecieve.number}
                  </EasyCopy>
                </KeyValuePair>
                <KeyValuePair label={t("seller-info")}>
                  {StockRecieve.sellerInfo}
                </KeyValuePair>
                <KeyValuePair label={t("purchaser")}>
                  {StockRecieve.purchaserName ? (
                    StockRecieve.purchaserName
                  ) : isGuidString(StockRecieve.purchaser) ? (
                    <UserName userId={StockRecieve.purchaser} placeholder="-" />
                  ) : (
                    StockRecieve.purchaser || "-"
                  )}
                </KeyValuePair>
              </KeyValueList>
            </Grid>
            <Grid item xs={12} md={6}>
              <KeyValueList>
                <KeyValuePair label={t("warehouse")}>
                  {StockRecieve.warehouseLabel || "-"}
                </KeyValuePair>
                <KeyValuePair label={t("date-of-purchase")}>
                  <UserDateTime
                    date={StockRecieve.dateOfPurchase}
                    displayType="DATEONLY"
                  />
                </KeyValuePair>
                <KeyValuePair label={t("created-at")}>
                  <UserDateTime date={StockRecieve.createdAt} />
                </KeyValuePair>
                {StockRecieve.changedAt && (
                  <KeyValuePair label={t("changed-at")}>
                    <UserDateTime date={StockRecieve.changedAt} />
                  </KeyValuePair>
                )}
              </KeyValueList>
            </Grid>
          </Grid>
        </CardContent>
      </PbCard>

      {StockRecieve.stockRecieveItems &&
        StockRecieve.stockRecieveItems.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <DataTable
              title={t("stock-receive-items")}
              tableKey="StockRecieveDetailsPage-Items"
              headerCells={StockRecieveItemHeaders}
              data={StockRecieveItemsTableProps}
              dataKey="id"
              showSearch={false}
              rowActions={stockRecieveItemActions}
            />
          </Box>
        )}
      <Dialog
        open={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t("stock-receive-item-details", {
            defaultValue: "Stock Receive Item Details",
          })}
        </DialogTitle>
        <DialogContent dividers>{renderDetailRows(detailRows)}</DialogContent>
        <DialogActions>
          <Button onClick={() => setActiveItem(null)}>
            {t("close", { defaultValue: "Close" })}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}

export default StockRecieveDetailsPage;
