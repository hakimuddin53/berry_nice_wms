import { Box, CardContent, Grid, Typography } from "@mui/material";
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
import { StockRecieveDetailsDto } from "interfaces/v12/StockRecieve/StockRecieveDetails/StockRecieveDetailsDto";
import { StockRecieveItemDetailsDto } from "interfaces/v12/StockRecieve/StockRecieveDetails/StockRecieveItemDetailsDto";

import { useDatatableControls } from "hooks/useDatatableControls";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useStockRecieveService } from "services/StockRecieveService";

function StockRecieveDetailsPage() {
  const { t } = useTranslation("common");
  const { id } = useParams();

  const StockRecieveService = useStockRecieveService();
  const [StockRecieve, setStockRecieve] =
    useState<StockRecieveDetailsDto | null>(null);
  const {
    updateDatatableControls: updateStockRecieveItemsTableControls,
    tableProps: StockRecieveItemsTableProps,
  } = useDatatableControls<StockRecieveItemDetailsDto>({
    initialData: [],
  });

  const StockRecieveItemHeaders = useMemo<
    DataTableHeaderCell<StockRecieveItemDetailsDto>[]
  >(
    () => [
      {
        id: "productCode",
        label: t("product-code"),
        render: (item) => item.productCode || "-",
      },
      {
        id: "productName",
        label: t("product"),
        render: (item) => item.productName || item.model || "-",
      },
      {
        id: "model",
        label: t("model"),
        render: (item) => item.model || "-",
      },
      {
        id: "grade",
        label: t("grade"),
        render: (item) => item.grade || "-",
      },
      {
        id: "imeiSerialNumber",
        label: t("imei", { defaultValue: "IMEI/Serial Number" }),
        render: (item) => item.imeiSerialNumber || "-",
      },
      {
        id: "locationId",
        label: t("location"),
        render: (item) => item.locationId || "-",
      },
      {
        id: "cost",
        label: t("cost"),
        render: (item) => (
          <Box sx={{ textAlign: "right", width: "100%" }}>
            {item.cost !== undefined && item.cost !== null
              ? item.cost.toFixed(2)
              : "-"}
          </Box>
        ),
      },
      {
        id: "retailSellingPrice",
        label: t("retail-selling-price"),
        render: (item) => (
          <Box sx={{ textAlign: "right", width: "100%" }}>
            {item.retailSellingPrice !== undefined &&
            item.retailSellingPrice !== null
              ? item.retailSellingPrice.toFixed(2)
              : "-"}
          </Box>
        ),
      },
      {
        id: "dealerSellingPrice",
        label: t("dealer-selling-price"),
        render: (item) => (
          <Box sx={{ textAlign: "right", width: "100%" }}>
            {item.dealerSellingPrice !== undefined &&
            item.dealerSellingPrice !== null
              ? item.dealerSellingPrice.toFixed(2)
              : "-"}
          </Box>
        ),
      },
      {
        id: "receiveQuantity",
        label: t("quantity"),
        render: (item) => (
          <Box sx={{ textAlign: "right", width: "100%" }}>
            {item.receiveQuantity ?? "-"}
          </Box>
        ),
      },
    ],
    [t]
  );

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
                  {StockRecieve.purchaser}
                </KeyValuePair>
              </KeyValueList>
            </Grid>
            <Grid item xs={12} md={6}>
              <KeyValueList>
                <KeyValuePair label={t("warehouse")}>
                  {StockRecieve.warehouseLabel || "-"}
                </KeyValuePair>
                <KeyValuePair label={t("date-of-purchase")}>
                  {new Date(StockRecieve.dateOfPurchase).toLocaleDateString()}
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
            />
          </Box>
        )}
    </Page>
  );
}

export default StockRecieveDetailsPage;
