import { CardContent, Chip, Grid } from "@mui/material";
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
import SimpleDataTable from "components/platbricks/shared/dataTable/SimpleDataTable";
import useDeleteConfirmationDialog from "hooks/useDeleteConfimationDialog";
import {
  StockReservationDetailsDto,
  StockReservationItemDetailsDto,
} from "interfaces/v12/stockReservation/stockReservationDetails/stockReservationDetailsDto";

import UserName from "components/platbricks/entities/UserName";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useStockReservationService } from "services/StockReservationService";
import { guid } from "types/guid";
import { getReservationStatusName } from "utils/helper";
import { getChipColor } from "../../../constants";
import { useStockReservationItemTable } from "../datatables/useStockReservationItemTable";
import StockReservationItemDetails from "./components/StockReservationItemDetails";

function StockReservationDetailsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const { id } = useParams();

  const StockReservationService = useStockReservationService();
  const [stockReservation, setStockReservation] =
    useState<StockReservationDetailsDto | null>(null);

  const [stockReservationItemTable] = useStockReservationItemTable();

  const { OpenDeleteConfirmationDialog } = useDeleteConfirmationDialog();

  const [pageBlocker, setPageBlocker] = useState(false);

  const [selectedStockReservationItem, setSelectedStockReservationItem] =
    useState<StockReservationItemDetailsDto | null>(null);

  useEffect(() => {
    StockReservationService.getStockReservationById(id as guid)
      .then((stockReservation) => setStockReservation(stockReservation))
      .catch((err) => {});
  }, [StockReservationService, id]);

  if (!stockReservation) {
    return (
      <Page
        pagename={t("stock-reservation")}
        breadcrumbs={[]}
        title={"Not Found"}
      ></Page>
    );
  }

  return (
    <Page
      title={t("stock-reservation")}
      subtitle={stockReservation.id}
      showBackdrop={pageBlocker}
      breadcrumbs={[
        {
          label: t("common:dashboard"),
          to: "/",
        },
        {
          label: t("stock-reservations"),
          to: `/stock-reservation`,
        },
        {
          label: stockReservation.id,
        },
      ]}
      actions={[
        {
          title: t("common:edit"),
          to: "edit",
          icon: "Edit",
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
          <PbTab label={t("common:details")} />
          <PbTab
            label={
              <BadgeText
                number={stockReservation?.stockReservationItems?.length ?? 0}
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
                    <EasyCopy clipboard={stockReservation.number}>
                      {stockReservation.number}
                    </EasyCopy>
                  </KeyValuePair>
                  <KeyValuePair label={t("warehouse")}>
                    {stockReservation.warehouseId || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("reserved-at")}>
                    {stockReservation.reservedAt ? (
                      <UserDateTime date={stockReservation.reservedAt} />
                    ) : (
                      "-"
                    )}
                  </KeyValuePair>
                  <KeyValuePair label={t("expires-at")}>
                    {stockReservation.expiresAt ? (
                      <UserDateTime date={stockReservation.expiresAt} />
                    ) : (
                      "-"
                    )}
                  </KeyValuePair>
                  <KeyValuePair label={t("status")}>
                    <Chip
                      label={getReservationStatusName(stockReservation.status)}
                      color={getChipColor(stockReservation.status)}
                    />
                  </KeyValuePair>
                  <KeyValuePair label={t("cancellation-remark")}>
                    {stockReservation.cancellationRemark || "-"}
                  </KeyValuePair>
                  <KeyValuePair label={t("cancellation-requested-by")}>
                    {stockReservation.cancellationRequestedBy ? (
                      <UserName
                        userId={stockReservation.cancellationRequestedBy}
                        placeholder="-"
                      />
                    ) : (
                      "-"
                    )}
                  </KeyValuePair>
                  <KeyValuePair label={t("cancellation-requested-at")}>
                    {stockReservation.cancellationRequestedAt ? (
                      <UserDateTime
                        date={stockReservation.cancellationRequestedAt}
                      />
                    ) : (
                      "-"
                    )}
                  </KeyValuePair>
                  <KeyValuePair label={t("cancellation-approved-by")}>
                    {stockReservation.cancellationApprovedBy ? (
                      <UserName
                        userId={stockReservation.cancellationApprovedBy}
                        placeholder="-"
                      />
                    ) : (
                      "-"
                    )}
                  </KeyValuePair>
                  <KeyValuePair label={t("cancellation-approved-at")}>
                    {stockReservation.cancellationApprovedAt ? (
                      <UserDateTime
                        date={stockReservation.cancellationApprovedAt}
                      />
                    ) : (
                      "-"
                    )}
                  </KeyValuePair>
                </KeyValueList>
              </Grid>
            </Grid>
            <br />
          </PbTabPanel>
          <PbTabPanel value={tab} index={1}>
            <SimpleDataTable
              title={t("items")}
              tableKey="StockReservationDetailsPage-Items"
              headerCells={stockReservationItemTable}
              data={stockReservation.stockReservationItems}
              dataKey="id"
              onSelectionChanged={(x: StockReservationItemDetailsDto[]) =>
                setSelectedStockReservationItem(x[0])
              }
            />
          </PbTabPanel>
        </CardContent>
      </PbCard>
      {tab === 1 && selectedStockReservationItem && (
        <StockReservationItemDetails
          stockReservationItem={selectedStockReservationItem}
        ></StockReservationItemDetails>
      )}
    </Page>
  );
}

export default StockReservationDetailsPage;
