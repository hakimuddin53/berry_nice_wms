import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useStockTakeTable = () => {
  const { t } = useTranslation();

  const headerCells: DataTableHeaderCell<any>[] = useMemo(
    () => [
      { id: "number", label: t("number") },
      { id: "warehouseName", label: t("warehouse") },
      {
        id: "takenAt",
        label: t("common:created-at"),
        render: (row) => <UserDateTime date={row.takenAt} />,
      },
    ],
    [t]
  );

  return [headerCells] as const;
};
