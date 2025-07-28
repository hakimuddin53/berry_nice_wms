import ProductName from "components/platbricks/entities/ProductName";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { StockReservationItemDetailsDto } from "interfaces/v12/stockReservation/stockReservationDetails/stockReservationDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const hidden = true;

export const useStockReservationItemTable = () => {
  const { t } = useTranslation();

  const stockReservationItemData = useMemo<
    DataTableHeaderCell<StockReservationItemDetailsDto>[]
  >(
    () => [
      {
        id: "id",
        label: t("common:id"),
        hidden,
      },
      {
        id: "product",
        label: t("product"),
        render: (row) => <ProductName productId={row.productId} />,
      },
      {
        id: "quantity",
        label: t("quantity"),
        render: (row) => {
          return row.quantity ? row.quantity.toString() : <span />;
        },
      },
    ],
    [t]
  );

  useCreatedChangeDate(stockReservationItemData, hidden);

  return [stockReservationItemData];
};
