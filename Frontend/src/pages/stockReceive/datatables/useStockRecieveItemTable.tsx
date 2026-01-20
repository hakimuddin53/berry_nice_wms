import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { YupStockRecieveItemCreateEdit } from "../createEdit/yup/StockRecieveCreateEditSchema";

const hidden = true;

export const useStockRecieveItemTable = () => {
  const { t } = useTranslation("common");

  const formatNumber = (value?: number | null) =>
    value == null ? "-" : value.toString();

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
        id: "modelId",
        label: t("model"),
        render: (row) => (row as any).modelName || (row as any).model || "-",
      },
      {
        id: "year",
        label: t("year", { defaultValue: "Year" }),
        render: (row) => (row.year != null ? row.year.toString() : "-"),
      },
      {
        id: "batteryHealth",
        label: t("battery-health", { defaultValue: "Battery Health (%)" }),
        render: (row) =>
          row.batteryHealth != null ? `${row.batteryHealth}%` : "-",
      },
      {
        id: "gradeId",
        label: t("grade"),
        render: (row) => row.gradeName || row.gradeId || "-",
      },
      {
        id: "serialNumber",
        label: t("imei", { defaultValue: "IMEI/Serial Number" }),
        render: (row) => row.serialNumber || "-",
      },
      {
        id: "locationId",
        label: t("location"),
        render: (row) =>
          row.locationName || row.locationLabel || row.locationId || "-",
      },
      {
        id: "cost",
        label: t("cost"),
        render: (row) => formatNumber(row.cost),
      },
      {
        id: "retailSellingPrice",
        label: t("retail-selling-price"),
        render: (row) => formatNumber(row.retailSellingPrice),
      },
      {
        id: "dealerSellingPrice",
        label: t("dealer-selling-price"),
        render: (row) => formatNumber(row.dealerSellingPrice),
      },
    ],
    [t]
  );

  useCreatedChangeDate(StockRecieveItemData, hidden);

  return [StockRecieveItemData];
};
