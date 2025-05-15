import { Link } from "@mui/material";
import WarehouseName from "components/platbricks/entities/WarehouseName";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { StockAdjustmentDetailsDto } from "interfaces/v12/stockAdjustment/stockAdjustmentDetails/stockAdjustmentDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import EasyCopy from "../../../../components/platbricks/shared/EasyCopy";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

const hidden = true;

export const useStockAdjustmentTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const stockAdjustmentData = useMemo<
    DataTableHeaderCell<StockAdjustmentDetailsDto>[]
  >(
    () => [
      {
        id: "stockAdjustmentId",
        label: t("stock-adjustment-id"),
        hidden,
      },
      {
        id: "number",
        label: t("common:number"),
        render: (row) => (
          <EasyCopy clipboard={row.number}>
            <Link component={NavLink} to={`/stock-adjustment/${row.id}`}>
              {row.number || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "warehouse",
        label: t("warehouse"),
        render: (row) => <WarehouseName warehouseId={row.warehouseId} />,
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(stockAdjustmentData);

  return [stockAdjustmentData];
};
