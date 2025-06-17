import LocationName from "components/platbricks/entities/LocationName";
import ProductName from "components/platbricks/entities/ProductName";
import SizeName from "components/platbricks/entities/SizeName";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { StockInItemDetailsDto } from "interfaces/v12/stockin/stockInDetails/stockInDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const hidden = true;

export const useStockInItemTable = () => {
  const { t } = useTranslation();

  const stockInItemData = useMemo<DataTableHeaderCell<StockInItemDetailsDto>[]>(
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

  useCreatedChangeDate(stockInItemData, hidden);

  return [stockInItemData];
};
