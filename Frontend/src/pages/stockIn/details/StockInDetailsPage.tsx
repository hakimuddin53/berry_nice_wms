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
import {
  StockInDetailsDto,
  StockInItemDetailsDto,
} from "interfaces/v12/stockin/stockInDetails/stockInDetailsDto";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useStockInService } from "services/StockInService";
import { guid } from "types/guid";
import { useStockInItemTable } from "../datatables/useStockInItemTable";
import StockInItemDetails from "./components/StockInItemDetails";

function StockInDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const StockInService = useStockInService();
  const [stockIn, setStockIn] = useState<StockInDetailsDto | null>(null);

  const [stockInItemTable] = useStockInItemTable();

  console.log(stockIn);

  const [pageBlocker, setPageBlocker] = useState(false);

  const [selectedStockInItem, setSelectedStockInItem] =
    useState<StockInItemDetailsDto | null>(null);

  const loadStockIn = useCallback(() => {
    StockInService.getStockInById(id as guid)
      .then((stockIn) => setStockIn(stockIn))
      .catch((err) => {});
  }, [StockInService, id]);

  useEffect(() => {
    loadStockIn();
  }, [loadStockIn, id]);

  if (!stockIn) {
    return (
      <Page
        pagename={t("stock-in")}
        breadcrumbs={[]}
        title={"Stock Not Found"}
      ></Page>
    );
  }

  return (
    <Page
      title={t("stock-in")}
      subtitle={stockIn.number}
      showBackdrop={pageBlocker}
      breadcrumbs={[
        {
          label: t("dashboard"),
          to: "/",
        },
        {
          label: t("stock-in"),
          to: `/stock-in`,
        },
        {
          label: stockIn.number,
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
                number={stockIn?.stockInItems?.length ?? 0}
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
                    <EasyCopy clipboard={stockIn.number}>
                      {stockIn.number}
                    </EasyCopy>
                  </KeyValuePair>
                  <KeyValuePair label={t("po-number")}>
                    {stockIn.poNumber}
                  </KeyValuePair>
                  <KeyValuePair label={t("warehouse")}>
                    {stockIn.warehouse}
                  </KeyValuePair>
                  <KeyValuePair label={t("rack")}>
                    {stockIn.location}
                  </KeyValuePair>
                  <KeyValuePair label={t("created-at")}>
                    <UserDateTime date={stockIn.createdAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-at")}>
                    <UserDateTime date={stockIn.changedAt} />
                  </KeyValuePair>
                  <KeyValuePair label={t("created-by")}>
                    <UserName userId={stockIn.createdById} placeholder="-" />
                  </KeyValuePair>
                  <KeyValuePair label={t("changed-by")}>
                    <UserName userId={stockIn.changedById} placeholder="-" />
                  </KeyValuePair>
                </KeyValueList>
              </Grid>
            </Grid>
            <br />
          </PbTabPanel>
          <PbTabPanel value={tab} index={1}>
            <SimpleDataTable
              title={t("items")}
              tableKey="StockInDetailsPage-Items"
              headerCells={stockInItemTable}
              data={stockIn.stockInItems}
              dataKey="id"
              onSelectionChanged={(x: StockInItemDetailsDto[]) =>
                setSelectedStockInItem(x[0])
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

      {tab === 1 && selectedStockInItem && (
        <StockInItemDetails
          stockInItem={selectedStockInItem}
        ></StockInItemDetails>
      )}
    </Page>
  );
}

export default StockInDetailsPage;
