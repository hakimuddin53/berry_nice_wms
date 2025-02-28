import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { InventoryDetailsDto } from "interfaces/v12/inventory/inventory";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

export const useInventoryTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const warehouseData = useMemo<DataTableHeaderCell<InventoryDetailsDto>[]>(
    () => [
      {
        id: "id",
        label: t("id"),
      },
      {
        id: "productId",
        label: t("product"),
      },
      {
        id: "productCartonSizeId",
        label: t("uom"),
      },
      {
        id: "warehouseId",
        label: t("warehouse"),
      },
      {
        id: "currentLocationId",
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
        label: t("new-balance"),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(warehouseData);

  return [warehouseData];
};
