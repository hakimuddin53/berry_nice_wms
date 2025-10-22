import ProductName from "components/platbricks/entities/ProductName";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { YupStockInItemCreateEdit } from "../createEdit/yup/stockInCreateEditSchema";

const hidden = true;

export const useStockInItemTable = () => {
  const { t } = useTranslation();

  const stockInItemData = useMemo<
    DataTableHeaderCell<YupStockInItemCreateEdit>[]
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
        id: "productCode",
        label: t("product-code"),
        render: (row) => row.productCode || "-",
      },
      {
        id: "primarySerialNumber",
        label: t("primary-serial-number"),
        render: (row) => row.primarySerialNumber || "-",
      },
      {
        id: "locationId",
        label: t("location"),
        render: (row) => row.locationId || "-",
      },
      {
        id: "cost",
        label: t("cost"),
        render: (row) => (row.cost !== undefined ? row.cost.toString() : "-"),
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

  useCreatedChangeDate(stockInItemData, hidden);

  return [stockInItemData];
};
