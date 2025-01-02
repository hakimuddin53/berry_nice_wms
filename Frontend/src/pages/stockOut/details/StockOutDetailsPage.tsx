import { CardContent, Grid, Typography } from "@mui/material";
import UserName from "components/platbricks/entities/UserName";
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
  StockOutDetailsDto,
  StockOutItemDetailsDto,
} from "interfaces/v12/stockout/stockOutDetails/stockOutDetailsDto";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useNotificationService } from "services/NotificationService";
import { useStockOutService } from "services/StockOutService";
import { guid } from "types/guid";
import { useStockOutItemTable } from "../datatables/useStockOutItemTable";
import StockOutItemDetails from "./components/StockOutItemDetails";

function StockOutDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const StockOutService = useStockOutService();
  const [stockOut, setStockOut] = useState<StockOutDetailsDto | null>(null);

  const [stockOutItemTable] = useStockOutItemTable();

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const notificationService = useNotificationService();
  const [pageBlocker, setPageBlocker] = useState(false);

  const [selectedStockOutItem, setSelectedStockOutItem] =
    useState<StockOutItemDetailsDto | null>(null);

  const loadStockOut = useCallback(() => {
    StockOutService.getStockOutById(id as guid)
      .then((stockOut) => setStockOut(stockOut))
      .catch((err) => {});
  }, [StockOutService, id]);

  useEffect(() => {
    loadStockOut();
  }, [loadStockOut, id]);

  if (!stockOut) {
    return (
      <Page
        pagename={t("stock-out")}
        breadcrumbs={[]}
        title={"Stock Not Found"}
      ></Page>
    );
  }

  return (
    <Page
      title={t("stock-out")}
      subtitle={stockOut.number}
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
          label: stockOut.number,
        },
      ]}
      actions={[
        {
          title: t("edit"),
          to: "edit",
          icon: "Edit",
          pageConfigIdentifier: "edit",
        },
        {
          title: t("delete"),
          icon: "Delete",
          onclick: () => {
            OpenDeleteConfirmationDialog({
              onConfirmDeletion: async () => {
                await StockOutService.deleteStockOut(stockOut.id);
              },
              setPageBlocker: setPageBlocker,
              entity: "stock-out",
              translationNamespace: "common",
              deleteDataName: stockOut.number,
              redirectLink: `/stock-out`,
            });
          },
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
                number={stockOut?.stockOutItemDetails?.length ?? 0}
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
                  <KeyValuePair label={t("delivery")}>
                    <EasyCopy clipboard={stockOut.number}>
                      {stockOut.number}
                    </EasyCopy>
                  </KeyValuePair>

                  <KeyValuePair label={t("created-at")}>
                    <UserDateTime date={stockOut.createdAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-at")}>
                    <UserDateTime date={stockOut.changedAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("created-by")}>
                    <UserName userId={stockOut.createdById} placeholder="-" />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-by")}>
                    <UserName userId={stockOut.changedById} placeholder="-" />
                  </KeyValuePair>
                </KeyValueList>
              </Grid>
            </Grid>
            <br />
          </PbTabPanel>
          <PbTabPanel value={tab} index={1}>
            <SimpleDataTable
              title={t("items")}
              tableKey="StockOutDetailsPage-Items"
              headerCells={stockOutItemTable}
              data={stockOut.stockOutItemDetails}
              dataKey="stockOutItemId"
              onSelectionChanged={(x: StockOutItemDetailsDto[]) =>
                setSelectedStockOutItem(x[0])
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

      {tab === 1 && selectedStockOutItem && (
        <StockOutItemDetails
          stockOutItem={selectedStockOutItem}
        ></StockOutItemDetails>
      )}
    </Page>
  );
}

export default StockOutDetailsPage;
