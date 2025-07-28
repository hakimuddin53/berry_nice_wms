import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { InventorySummaryByProductDetailsDto } from "interfaces/v12/inventory/inventory";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useInventoryByProductSummaryTable = () => {
  const { t } = useTranslation();

  const summaryData = useMemo<
    DataTableHeaderCell<InventorySummaryByProductDetailsDto>[]
  >(
    () => [
      {
        id: "product",
        label: t("product"),
        render: (row) => row.product,
      },
      {
        id: "warehouse",
        label: t("warehouse"),
        render: (row) => row.warehouse,
      },
      {
        id: "clientCode",
        label: t("client-code"),
        render: (row) => row.clientCode,
      },
      {
        id: "stockGroup",
        label: t("carton-size"),
        render: (row) => row.stockGroup,
      },
      {
        id: "size",
        label: t("size"),
        render: (row) => row.size,
      },
      {
        id: "availableQuantity",
        label: t("available-quantity"),
        render: (row) => row.availableQuantity.toLocaleString(), // formatted number
      },
      {
        id: "reservedQuantity",
        label: t("reserved-quantity"),
        render: (row) => row.reservedQuantity.toLocaleString(), // formatted number
      },
      {
        id: "availableAfterReserved",
        label: t("available-after-reserved"),
        render: (row) => row.availableAfterReserved.toLocaleString(), // formatted number
      },
    ],
    [t]
  );

  return [summaryData];
};
