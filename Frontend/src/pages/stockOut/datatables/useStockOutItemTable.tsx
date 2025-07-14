import LocationName from "components/platbricks/entities/LocationName";
import ProductName from "components/platbricks/entities/ProductName";
import SizeName from "components/platbricks/entities/SizeName";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { StockOutItemDetailsDto } from "interfaces/v12/stockout/stockOutDetails/stockOutDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const hidden = true;

export const useStockOutItemTable = () => {
  const { t } = useTranslation();

  const stockOutItemData = useMemo<
    DataTableHeaderCell<StockOutItemDetailsDto>[]
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
        id: "size",
        label: t("size"),
        render: (row) => <SizeName productId={row.productId} />,
      },
      {
        id: "rack",
        label: t("rack"),
        render: (row) => <LocationName locationId={row.locationId} />,
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

  useCreatedChangeDate(stockOutItemData, hidden);

  return [stockOutItemData];
};
