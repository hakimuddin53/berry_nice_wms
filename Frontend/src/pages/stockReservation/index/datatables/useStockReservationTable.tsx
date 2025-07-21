import { Link } from "@mui/material";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { StockReservationDetailsDto } from "interfaces/v12/stockReservation/stockReservationDetails/stockReservationDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import EasyCopy from "../../../../components/platbricks/shared/EasyCopy";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

export const useStockReservationTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const stockReservationData = useMemo<
    DataTableHeaderCell<StockReservationDetailsDto>[]
  >(
    () => [
      {
        id: "id",
        label: t("stock-reservation-id"),
      },
      {
        id: "number",
        label: t("common:number"),
        render: (row) => (
          <EasyCopy clipboard={row.number}>
            <Link component={NavLink} to={`/stock-reservation/${row.id}`}>
              {row.number || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "productId",
        label: t("product"),
      },
      {
        id: "quantity",
        label: t("quantity"),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(stockReservationData);

  return [stockReservationData];
};
