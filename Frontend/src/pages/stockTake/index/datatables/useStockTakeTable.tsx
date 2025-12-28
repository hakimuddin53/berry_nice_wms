import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useStockTakeTable = () => {
  const { t } = useTranslation();

  const headerCells: DataTableHeaderCell<any>[] = useMemo(
    () => [
      { id: "number", label: t("number") },
      { id: "warehouseName", label: t("warehouse") },
      { id: "takenAt", label: t("common:created-at") },
      { id: "items", label: t("items") },
    ],
    [t]
  );

  return [headerCells] as const;
};
