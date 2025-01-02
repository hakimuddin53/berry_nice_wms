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
        id: "stockInItemNumber",
        label: t("common:item"),
      },
      {
        id: "quantity",
        label: t("quantity"),
        render: (row) => {
          return row.quantity ? row.quantity.toString() : <span />;
        },
      },
      {
        id: "listPrice",
        label: t("common:listPrice"),
      },
    ],
    [t]
  );

  useCreatedChangeDate(stockInItemData, hidden);

  return [stockInItemData];
};
