import LocationName from "components/platbricks/entities/LocationName";
import ProductName from "components/platbricks/entities/ProductName";
import WarehouseName from "components/platbricks/entities/WarehouseName";
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
        id: "product",
        label: t("product"),
        render: (row) => <ProductName productId={row.productId} />,
      },

      {
        id: "fromWarehouse",
        label: t("source-warehouse"),
        render: (row) => <WarehouseName warehouseId={row.fromWarehouseId} />,
      },
      {
        id: "fromLocation",
        label: t("source-location"),
        render: (row) => <LocationName locationId={row.fromLocationId} />,
      },
      {
        id: "toWarehouse",
        label: t("destination-warehouse"),
        render: (row) => <WarehouseName warehouseId={row.toWarehouseId} />,
      },
      {
        id: "toLocation",
        label: t("destination-location"),
        render: (row) => <LocationName locationId={row.toLocationId} />,
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
    ],
    [t]
  );

  useCreatedChangeDate(stockTransferItemData, hidden);

  return [stockTransferItemData];
};
