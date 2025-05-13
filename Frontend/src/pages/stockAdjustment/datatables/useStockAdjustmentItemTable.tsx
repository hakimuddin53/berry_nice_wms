import ProductName from "components/platbricks/entities/ProductName";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { StockAdjustmentItemDetailsDto } from "interfaces/v12/stockAdjustment/stockAdjustmentDetails/stockAdjustmentDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const hidden = true;

export const useStockAdjustmentItemTable = () => {
  const { t } = useTranslation();

  const stockAdjustmentItemData = useMemo<
    DataTableHeaderCell<StockAdjustmentItemDetailsDto>[]
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

  useCreatedChangeDate(stockAdjustmentItemData, hidden);

  return [stockAdjustmentItemData];
};
