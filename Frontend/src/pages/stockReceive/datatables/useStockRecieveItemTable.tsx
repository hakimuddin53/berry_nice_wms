import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { YupStockRecieveItemCreateEdit } from "../createEdit/yup/StockRecieveCreateEditSchema";

const hidden = true;

export const useStockRecieveItemTable = () => {
  const { t } = useTranslation("common");

  const StockRecieveItemData = useMemo<
    DataTableHeaderCell<YupStockRecieveItemCreateEdit>[]
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
        render: (row) => row.model || row.productCode || "-",
      },
      {
        id: "model",
        label: t("model"),
        render: (row) => row.model || "-",
      },
      {
        id: "grade",
        label: t("grade"),
        render: (row) => row.grade || "-",
      },
      {
        id: "imeiSerialNumber",
        label: t("imei", { defaultValue: "IMEI/Serial Number" }),
        render: (row) => row.imeiSerialNumber || "-",
      },
      {
        id: "locationId",
        label: t("location"),
        render: (row) => row.locationName || row.locationId || "-",
      },
      {
        id: "cost",
        label: t("cost"),
        render: (row) => (row.cost !== undefined ? row.cost.toString() : "-"),
      },
      {
        id: "retailSellingPrice",
        label: t("retail-selling-price"),
        render: (row) =>
          row.retailSellingPrice !== undefined
            ? row.retailSellingPrice.toString()
            : "-",
      },
      {
        id: "dealerSellingPrice",
        label: t("dealer-selling-price"),
        render: (row) =>
          row.dealerSellingPrice !== undefined
            ? row.dealerSellingPrice.toString()
            : "-",
      },
      {
        id: "receiveQuantity",
        label: t("quantity"),
        render: (row) =>
          row.receiveQuantity ? row.receiveQuantity.toString() : "-",
      },
    ],
    [t]
  );

  useCreatedChangeDate(StockRecieveItemData, hidden);

  return [StockRecieveItemData];
};
