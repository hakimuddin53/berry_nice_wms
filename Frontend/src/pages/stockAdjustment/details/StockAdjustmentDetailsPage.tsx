import { CardContent, Grid, Typography } from "@mui/material";
import UserName from "components/platbricks/entities/UserName";
import WarehouseName from "components/platbricks/entities/WarehouseName";
import {
  BadgeText,
  EasyCopy,
  KeyValueList,
  KeyValuePair,
  Page,
  PbCard,
  PbTab,
  PbTabPanel,
  PbTabs,
} from "components/platbricks/shared";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import SimpleDataTable from "components/platbricks/shared/dataTable/SimpleDataTable";
import useDeleteConfirmationDialog from "hooks/useDeleteConfimationDialog";
import {
  StockAdjustmentDetailsDto,
  StockAdjustmentItemDetailsDto,
} from "interfaces/v12/stockAdjustment/stockAdjustmentDetails/stockAdjustmentDetailsDto";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useStockAdjustmentService } from "services/StockAdjustmentService";
import { guid } from "types/guid";
import { useStockAdjustmentItemTable } from "../datatables/useStockAdjustmentItemTable";
import StockAdjustmentItemDetails from "./components/StockAdjustmentItemDetails";

function StockAdjustmentDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const StockAdjustmentService = useStockAdjustmentService();
  const [stockAdjustment, setStockAdjustment] =
    useState<StockAdjustmentDetailsDto | null>(null);

  const [stockAdjustmentItemTable] = useStockAdjustmentItemTable();

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  const [selectedStockAdjustmentItem, setSelectedStockAdjustmentItem] =
    useState<StockAdjustmentItemDetailsDto | null>(null);

  const loadStockAdjustment = useCallback(() => {
    StockAdjustmentService.getStockAdjustmentById(id as guid)
      .then((stockAdjustment) => setStockAdjustment(stockAdjustment))
      .catch((err) => {});
  }, [StockAdjustmentService, id]);

  useEffect(() => {
    loadStockAdjustment();
  }, [loadStockAdjustment, id]);

  if (!stockAdjustment) {
    return (
      <Page
        pagename={t("stock-adjustment")}
        breadcrumbs={[]}
        title={"Stock Not Found"}
      ></Page>
    );
  }

  return (
    <Page
      title={t("stock-out")}
      subtitle={stockAdjustment.number}
      showBackdrop={pageBlocker}
      breadcrumbs={[
        {
          label: t("dashboard"),
          to: "/",
        },
        {
          label: t("stock-out"),
          to: `/stock-out`,
        },
        {
          label: stockAdjustment.number,
        },
      ]}
      actions={[
        {
          title: t("edit"),
          to: "edit",
          icon: "Edit",
          pageConfigIdentifier: "edit",
        },
      ]}
    >
      <PbCard px={2} pt={2}>
        <PbTabs
          value={tab}
          onChange={(event: React.SyntheticEvent, newValue: number) => {
            setTab(newValue);
          }}
        >
          <PbTab label={t("details")} />
          <PbTab
            label={
              <BadgeText
                number={stockAdjustment?.stockAdjustmentItems?.length ?? 0}
                label={t("items")}
              />
            }
          />
        </PbTabs>
        <CardContent>
          <PbTabPanel value={tab} index={0}>
            <Grid container rowSpacing={100}>
              <Grid item xs={6}>
                <KeyValueList gridTemplateColumns="2fr 4fr">
                  <KeyValuePair label={t("number")}>
                    <EasyCopy clipboard={stockAdjustment.number}>
                      {stockAdjustment.number}
                    </EasyCopy>
                  </KeyValuePair>
                  <KeyValuePair label={t("warehouse")}>
                    <WarehouseName warehouseId={stockAdjustment.warehouseId} />
                  </KeyValuePair>
                  <KeyValuePair label={t("created-at")}>
                    <UserDateTime date={stockAdjustment.createdAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-at")}>
                    <UserDateTime date={stockAdjustment.changedAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("created-by")}>
                    <UserName
                      userId={stockAdjustment.createdById}
                      placeholder="-"
                    />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-by")}>
                    <UserName
                      userId={stockAdjustment.changedById}
                      placeholder="-"
                    />
                  </KeyValuePair>
                </KeyValueList>
              </Grid>
            </Grid>
            <br />
          </PbTabPanel>
          <PbTabPanel value={tab} index={1}>
            <SimpleDataTable
              title={t("items")}
              tableKey="StockAdjustmentDetailsPage-Items"
              headerCells={stockAdjustmentItemTable}
              data={stockAdjustment.stockAdjustmentItems}
              dataKey="id"
              onSelectionChanged={(x: StockAdjustmentItemDetailsDto[]) =>
                setSelectedStockAdjustmentItem(x[0])
              }
            />
          </PbTabPanel>
          <PbTabPanel value={tab} index={10}>
            <Typography variant="subtitle2" gutterBottom display="inline">
              {t("feature-unavailable")}
            </Typography>
          </PbTabPanel>
        </CardContent>
      </PbCard>

      {tab === 1 && selectedStockAdjustmentItem && (
        <StockAdjustmentItemDetails
          stockAdjustmentItem={selectedStockAdjustmentItem}
        ></StockAdjustmentItemDetails>
      )}
    </Page>
  );
}

export default StockAdjustmentDetailsPage;
