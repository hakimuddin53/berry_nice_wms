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
import { StockAdjustmentItemDetailsDto } from "interfaces/v12/stockAdjustment/stockAdjustmentDetails/stockAdjustmentDetailsDto";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const StockAdjustmentItemDetails: React.FC<{
  stockAdjustmentItem: StockAdjustmentItemDetailsDto;
}> = (props) => {
  const { t } = useTranslation();
  const { stockAdjustmentItem } = props;
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
                {stockAdjustmentItem.quantity}
              </KeyValuePair>
              <KeyValuePair label={t("product")}>
                {stockAdjustmentItem.product}
              </KeyValuePair>
              <KeyValuePair label={t("common:created-at")}>
                <UserDateTime date={stockAdjustmentItem.createdAt} />
              </KeyValuePair>
              <KeyValuePair label={t("common:created-by")}>
                <UserName
                  userId={stockAdjustmentItem.createdById}
                  placeholder="-"
                />
              </KeyValuePair>
              <KeyValuePair label={t("common:changed-at")}>
                <UserDateTime date={stockAdjustmentItem.changedAt} />
              </KeyValuePair>
              <KeyValuePair label={t("common:changed-by")}>
                <UserName
                  userId={stockAdjustmentItem.changedById}
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

export default StockAdjustmentItemDetails;
