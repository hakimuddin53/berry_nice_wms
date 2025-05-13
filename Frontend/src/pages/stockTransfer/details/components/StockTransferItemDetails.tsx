import { CardContent } from "@mui/material";
import UserName from "components/platbricks/entities/UserName";
import {
  KeyValueList,
  KeyValuePair,
  PbCard,
  PbTab,
  PbTabPanel,
  PbTabs,
} from "components/platbricks/shared";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { StockTransferItemDetailsDto } from "interfaces/v12/stockTransfer/stockTransferDetails/stockTransferDetailsDto";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const StockTransferItemDetails: React.FC<{
  stockTransferItem: StockTransferItemDetailsDto;
}> = (props) => {
  const { t } = useTranslation();
  const { stockTransferItem } = props;
  const [tab, setTab] = useState(0);

  return (
    <>
      <h2>{t("common:item")}</h2>
      <PbCard px={2} pt={2}>
        <PbTabs
          value={tab}
          onChange={(event: React.SyntheticEvent, newValue: number) => {
            setTab(newValue);
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <PbTab label={t("common:details")} />
        </PbTabs>
        <CardContent>
          <PbTabPanel value={tab} index={0}>
            <KeyValueList>
              <KeyValuePair label={t("quantity")}>
                {stockTransferItem.quantityTransferred}
              </KeyValuePair>
              <KeyValuePair label={t("product")}>
                {stockTransferItem.product}
              </KeyValuePair>
              <KeyValuePair label={t("source-warehouse")}>
                {stockTransferItem.fromWarehouse}
              </KeyValuePair>
              <KeyValuePair label={t("source-location")}>
                {stockTransferItem.fromLocation}
              </KeyValuePair>
              <KeyValuePair label={t("destination-warehouse")}>
                {stockTransferItem.toWarehouse}
              </KeyValuePair>
              <KeyValuePair label={t("destination-location")}>
                {stockTransferItem.toLocation}
              </KeyValuePair>
              <KeyValuePair label={t("common:created-at")}>
                <UserDateTime date={stockTransferItem.createdAt} />
              </KeyValuePair>
              <KeyValuePair label={t("common:created-by")}>
                <UserName
                  userId={stockTransferItem.createdById}
                  placeholder="-"
                />
              </KeyValuePair>
              <KeyValuePair label={t("common:changed-at")}>
                <UserDateTime date={stockTransferItem.changedAt} />
              </KeyValuePair>
              <KeyValuePair label={t("common:changed-by")}>
                <UserName
                  userId={stockTransferItem.changedById}
                  placeholder="-"
                />
              </KeyValuePair>
            </KeyValueList>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </>
  );
};

export default StockTransferItemDetails;
