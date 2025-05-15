import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { InventoryDetailsDto } from "interfaces/v12/inventory/inventory";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useInventoryTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const warehouseData = useMemo<DataTableHeaderCell<InventoryDetailsDto>[]>(
    () => [
      {
        id: "product",
        label: t("product"),
      },
      {
        id: "warehouse",
        label: t("warehouse"),
      },
      {
        id: "clientCode",
        label: t("client-code"),
      },
      {
        id: "stockGroup",
        label: t("carton-size"),
      },
      {
        id: "transactionNumber",
        label: t("transaction-number"),
      },
      {
        id: "currentLocation",
        label: t("location"),
      },
      {
        id: "quantityIn",
        label: t("quantity-in"),
      },
      {
        id: "quantityOut",
        label: t("quantity-out"),
      },
      {
        id: "oldBalance",
        label: t("old-balance"),
      },
      {
        id: "newBalance",
        label: t("available-balance"),
      },

      {
        id: "createdAt",
        label: t("common:created-at"),
        render: (row) => <UserDateTime date={row.createdAt} />,
      },
    ],
    [t]
  );
  /* eslint-enable */

  return [warehouseData];
};
