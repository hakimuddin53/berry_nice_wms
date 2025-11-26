import { Box, CardContent, Grid, Typography } from "@mui/material";
import {
  EasyCopy,
  DataTable,
  KeyValueList,
  KeyValuePair,
  Page,
  PbCard,
} from "components/platbricks/shared";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { StockInDetailsDto } from "interfaces/v12/stockIn/stockInDetails/stockInDetailsDto";
import { StockInItemDetailsDto } from "interfaces/v12/stockIn/stockInDetails/stockInItemDetailsDto";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDatatableControls } from "hooks/useDatatableControls";
import { useStockInService } from "services/StockInService";

function StockInDetailsPage() {
  const { t } = useTranslation("common");
  const { id } = useParams();

  const stockInService = useStockInService();
  const [stockIn, setStockIn] = useState<StockInDetailsDto | null>(null);
  const {
    updateDatatableControls: updateStockInItemsTableControls,
    tableProps: stockInItemsTableProps,
  } = useDatatableControls<StockInItemDetailsDto>({
    initialData: [],
  });

  const stockInItemHeaders = useMemo<
    DataTableHeaderCell<StockInItemDetailsDto>[]
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
        id: "primarySerialNumber",
        label: t("primary-serial-number"),
        render: (item) => item.primarySerialNumber || "-",
      },
      {
        id: "manufactureSerialNumber",
        label: t("manufacture-serial-number"),
        render: (item) => item.manufactureSerialNumber || "-",
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

  const loadStockIn = useCallback(() => {
    if (id) {
      stockInService
        .getStockInById(id)
        .then((stockIn) => setStockIn(stockIn))
        .catch((err) => {});
    }
  }, [stockInService, id]);

  useEffect(() => {
    loadStockIn();
  }, [loadStockIn]);

  useEffect(() => {
    if (stockIn?.stockInItems) {
      updateStockInItemsTableControls({
        data: stockIn.stockInItems,
      });
    }
  }, [stockIn?.stockInItems, updateStockInItemsTableControls]);

  if (!stockIn) {
    return (
      <Page title={t("stock-in")} breadcrumbs={[]}>
        <Typography>{t("loading")}</Typography>
      </Page>
    );
  }

  return (
    <Page
      title={t("stock-in")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("stock-in"), to: "/stock-in" },
        { label: stockIn.number },
      ]}
      actions={[{ title: t("edit"), icon: "Edit", to: "edit" }]}
    >
      <PbCard>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <KeyValueList>
                <KeyValuePair label={t("number")}>
                  <EasyCopy clipboard={stockIn.number}>
                    {stockIn.number}
                  </EasyCopy>
                </KeyValuePair>
                <KeyValuePair label={t("seller-info")}>
                  {stockIn.sellerInfo}
                </KeyValuePair>
                <KeyValuePair label={t("purchaser")}>
                  {stockIn.purchaser}
                </KeyValuePair>
              </KeyValueList>
            </Grid>
            <Grid item xs={12} md={6}>
              <KeyValueList>
                <KeyValuePair label={t("warehouse")}>
                  {stockIn.warehouseLabel || "-"}
                </KeyValuePair>
                <KeyValuePair label={t("date-of-purchase")}>
                  {new Date(stockIn.dateOfPurchase).toLocaleDateString()}
                </KeyValuePair>
                <KeyValuePair label={t("created-at")}>
                  <UserDateTime date={stockIn.createdAt} />
                </KeyValuePair>
                {stockIn.changedAt && (
                  <KeyValuePair label={t("changed-at")}>
                    <UserDateTime date={stockIn.changedAt} />
                  </KeyValuePair>
                )}
              </KeyValueList>
            </Grid>
          </Grid>
        </CardContent>
      </PbCard>

      {stockIn.stockInItems && stockIn.stockInItems.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <DataTable
            title={t("stock-in-items")}
            tableKey="StockInDetailsPage-Items"
            headerCells={stockInItemHeaders}
            data={stockInItemsTableProps}
            dataKey="id"
            showSearch={false}
          />
        </Box>
      )}
    </Page>
  );
}

export default StockInDetailsPage;
