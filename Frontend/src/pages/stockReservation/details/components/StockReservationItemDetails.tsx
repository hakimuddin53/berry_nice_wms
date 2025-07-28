import { CardContent } from "@mui/material";
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
import { StockReservationItemDetailsDto } from "interfaces/v12/stockReservation/stockReservationDetails/stockReservationDetailsDto";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const StockReservationItemDetails: React.FC<{
  stockReservationItem: StockReservationItemDetailsDto;
}> = (props) => {
  const { t } = useTranslation();
  const { stockReservationItem } = props;
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
                {stockReservationItem.quantity}
              </KeyValuePair>
              <KeyValuePair label={t("product")}>
                <ProductName productId={stockReservationItem.productId} />
              </KeyValuePair>
              <KeyValuePair label={t("common:created-at")}>
                <UserDateTime date={stockReservationItem.createdAt} />
              </KeyValuePair>
              <KeyValuePair label={t("common:created-by")}>
                <UserName
                  userId={stockReservationItem.createdById}
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

export default StockReservationItemDetails;
