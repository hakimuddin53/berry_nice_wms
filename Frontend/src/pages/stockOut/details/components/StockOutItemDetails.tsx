import { CardContent } from "@mui/material";
import LocationName from "components/platbricks/entities/LocationName";
import ProductName from "components/platbricks/entities/ProductName";
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
import { StockOutItemDetailsDto } from "interfaces/v12/stockout/stockOutDetails/stockOutDetailsDto";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const StockOutItemDetails: React.FC<{
  stockOutItem: StockOutItemDetailsDto;
}> = (props) => {
  const { t } = useTranslation();
  const { stockOutItem } = props;
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
                {stockOutItem.quantity}
              </KeyValuePair>
              <KeyValuePair label={t("product")}>
                <ProductName productId={stockOutItem.productId} />
              </KeyValuePair>
              <KeyValuePair label={t("rack")}>
                <LocationName locationId={stockOutItem.locationId} />
              </KeyValuePair>
              <KeyValuePair label={t("common:created-at")}>
                <UserDateTime date={stockOutItem.createdAt} />
              </KeyValuePair>
              <KeyValuePair label={t("common:created-by")}>
                <UserName userId={stockOutItem.createdById} placeholder="-" />
              </KeyValuePair>
              <KeyValuePair label={t("common:changed-at")}>
                <UserDateTime date={stockOutItem.changedAt} />
              </KeyValuePair>
              <KeyValuePair label={t("common:changed-by")}>
                <UserName userId={stockOutItem.changedById} placeholder="-" />
              </KeyValuePair>
            </KeyValueList>
          </PbTabPanel>
        </CardContent>
      </PbCard>
    </>
  );
};

export default StockOutItemDetails;
