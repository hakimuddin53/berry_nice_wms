import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useStockTransferTable = () => {
  const { t } = useTranslation();

  const headerCells: DataTableHeaderCell<any>[] = useMemo(
    () => [
      {
        id: "number",
        label: t("number"),
      },
      {
        id: "productCode",
        label: t("product"),
      },
      {
        id: "quantityTransferred",
        label: t("quantity"),
      },
      {
        id: "fromWarehouseName",
        label: t("from-warehouse", { defaultValue: "From Warehouse" }),
      },
      {
        id: "toWarehouseName",
        label: t("to-warehouse", { defaultValue: "To Warehouse" }),
      },
      {
        id: "createdAt",
        label: t("common:created-at"),
        render: (row) => <UserDateTime date={row.createdAt} />,
      },
    ],
    [t]
  );

  return [headerCells] as const;
};
