import { CardContent, Grid, Typography } from "@mui/material";
import {
  EasyCopy,
  KeyValueList,
  KeyValuePair,
  Page,
  PbCard,
} from "components/platbricks/shared";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { StockInDetailsDto } from "interfaces/v12/stockIn/stockInDetails/stockInDetailsDto";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useStockInService } from "services/StockInService";

function StockInDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();

  const stockInService = useStockInService();
  const [stockIn, setStockIn] = useState<StockInDetailsDto | null>(null);

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
        { label: t("stock-in"), to: "/stockin" },
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
                <KeyValuePair label={t("location")}>
                  {stockIn.location}
                </KeyValuePair>
                <KeyValuePair label={t("date-of-purchase")}>
                  {new Date(stockIn.dateOfPurchase).toLocaleDateString()}
                </KeyValuePair>
              </KeyValueList>
            </Grid>
            <Grid item xs={12} md={6}>
              <KeyValueList>
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
        <PbCard sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("stock-in-items")}
            </Typography>
            {/* TODO: Add items table */}
            <Typography>{stockIn.stockInItems.length} items</Typography>
          </CardContent>
        </PbCard>
      )}
    </Page>
  );
}

export default StockInDetailsPage;
