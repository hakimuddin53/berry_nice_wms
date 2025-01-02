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
import { StockInItemDetailsDto } from "interfaces/v12/stockin/stockInDetails/stockInDetailsDto";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const StockInItemDetails: React.FC<{
  stockInItem: StockInItemDetailsDto;
}> = (props) => {
  const { t } = useTranslation("stockIn");
  const { stockInItem } = props;
  const [tab, setTab] = useState(0);

  return (
    <>
      <h2>
        {t("common:item")} {stockInItem.stockInItemNumber}
      </h2>
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
              <KeyValuePair label={t("common:item")}>
                {stockInItem.stockInItemNumber}
              </KeyValuePair>

              <KeyValuePair label={t("quantity")}>
                {stockInItem.quantity}
              </KeyValuePair>
              <KeyValuePair label={t("list-price")}>
                {stockInItem.listPrice}
              </KeyValuePair>

              <KeyValuePair label={t("common:created-at")}>
                <UserDateTime date={stockInItem.createdAt} />
              </KeyValuePair>
              <KeyValuePair label={t("common:created-by")}>
                <UserName userId={stockInItem.createdById} placeholder="-" />
              </KeyValuePair>
              <KeyValuePair label={t("common:changed-at")}>
                <UserDateTime date={stockInItem.changedAt} />
              </KeyValuePair>
              <KeyValuePair label={t("common:changed-by")}>
                <UserName userId={stockInItem.changedById} placeholder="-" />
              </KeyValuePair>
            </KeyValueList>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </>
  );
};

export default StockInItemDetails;
