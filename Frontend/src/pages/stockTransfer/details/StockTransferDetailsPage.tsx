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
  StockTransferDetailsDto,
  StockTransferItemDetailsDto,
} from "interfaces/v12/stockTransfer/stockTransferDetails/stockTransferDetailsDto";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useNotificationService } from "services/NotificationService";
import { useStockTransferService } from "services/StockTransferService";
import { guid } from "types/guid";
import { useStockTransferItemTable } from "../datatables/useStockTransfertemTable";
import StockTransferItemDetails from "./components/StockTransferItemDetails";

function StockTransferDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const StockTransferService = useStockTransferService();
  const [stockTransfer, setStockTransfer] =
    useState<StockTransferDetailsDto | null>(null);

  const [stockTransferItemTable] = useStockTransferItemTable();

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const notificationService = useNotificationService();
  const [pageBlocker, setPageBlocker] = useState(false);

  const [selectedStockTransferItem, setSelectedStockTransferItem] =
    useState<StockTransferItemDetailsDto | null>(null);

  const loadStockTransfer = useCallback(() => {
    StockTransferService.getStockTransferById(id as guid)
      .then((stockTransfer) => setStockTransfer(stockTransfer))
      .catch((err) => {});
  }, [StockTransferService, id]);

  useEffect(() => {
    loadStockTransfer();
  }, [loadStockTransfer, id]);

  if (!stockTransfer) {
    return (
      <Page
        pagename={t("stock-transfer")}
        breadcrumbs={[]}
        title={"Stock Not Found"}
      ></Page>
    );
  }

  return (
    <Page
      title={t("stock-transfer")}
      subtitle={stockTransfer.number}
      showBackdrop={pageBlocker}
      breadcrumbs={[
        {
          label: t("dashboard"),
          to: "/",
        },
        {
          label: t("stock-transfer"),
          to: `/stock-transfer`,
        },
        {
          label: stockTransfer.number,
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
                number={stockTransfer?.stockTransferItems?.length ?? 0}
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
                    <EasyCopy clipboard={stockTransfer.number}>
                      {stockTransfer.number}
                    </EasyCopy>
                  </KeyValuePair>

                  <KeyValuePair label={t("created-at")}>
                    <UserDateTime date={stockTransfer.createdAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-at")}>
                    <UserDateTime date={stockTransfer.changedAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("created-by")}>
                    <UserName
                      userId={stockTransfer.createdById}
                      placeholder="-"
                    />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-by")}>
                    <UserName
                      userId={stockTransfer.changedById}
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
              tableKey="StockTransferDetailsPage-Items"
              headerCells={stockTransferItemTable}
              data={stockTransfer.stockTransferItems}
              dataKey="id"
              onSelectionChanged={(x: StockTransferItemDetailsDto[]) =>
                setSelectedStockTransferItem(x[0])
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

      {tab === 1 && selectedStockTransferItem && (
        <StockTransferItemDetails
          stockTransferItem={selectedStockTransferItem}
        ></StockTransferItemDetails>
      )}
    </Page>
  );
}

export default StockTransferDetailsPage;
