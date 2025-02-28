import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { StockTransferItemDetailsDto } from "interfaces/v12/stockTransfer/stockTransferDetails/stockTransferDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const hidden = true;

export const useStockTransferItemTable = () => {
  const { t } = useTranslation();

  const stockTransferItemData = useMemo<
    DataTableHeaderCell<StockTransferItemDetailsDto>[]
  >(
    () => [
      {
        id: "id",
        label: t("common:id"),
        hidden,
      },
      {
        id: "stockTransferItemNumber",
        label: t("common:item"),
      },
      {
        id: "product",
        label: t("product"),
      },
      {
        id: "fromWarehouse",
        label: t("source-warehouse"),
      },
      {
        id: "toWarehouse",
        label: t("destination-warehouse"),
      },
      {
        id: "quantityTransferred",
        label: t("quantity"),
        render: (row) => {
          return row.quantityTransferred ? (
            row.quantityTransferred.toString()
          ) : (
            <span />
          );
        },
      },
      {
        id: "listPrice",
        label: t("list-price"),
      },
    ],
    [t]
  );

  useCreatedChangeDate(stockTransferItemData, hidden);

  return [stockTransferItemData];
};
