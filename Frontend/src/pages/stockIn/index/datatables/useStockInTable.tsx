import { Link } from "@mui/material";
import WarehouseName from "components/platbricks/entities/WarehouseName";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { StockInDetailsDto } from "interfaces/v12/stockin/stockInDetails/stockInDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import EasyCopy from "../../../../components/platbricks/shared/EasyCopy";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

const hidden = true;

export const useStockInTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const stockInData = useMemo<DataTableHeaderCell<StockInDetailsDto>[]>(
    () => [
      {
        id: "id",
        label: t("stock-in-id"),
        hidden,
      },
      {
        id: "number",
        label: t("common:number"),
        render: (row) => (
          <EasyCopy clipboard={row.number}>
            <Link component={NavLink} to={`/stock-in/${row.id}`}>
              {row.number || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "poNumber",
        label: t("po-number"),
      },
      {
        id: "warehouse",
        label: t("warehouse"),
        render: (row) => <WarehouseName warehouseId={row.warehouseId} />,
      },
      {
        id: "print",
        label: t("print"),
        render: (row) => (
          <Link
            component={NavLink}
            to={`/stock-in/${row.id}/print`}
            underline="hover"
          >
            {t("print")}
          </Link>
        ),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(stockInData);
  return [stockInData];
};
