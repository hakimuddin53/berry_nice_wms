import { Link } from "@mui/material";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { useUserDateTime } from "hooks/useUserDateTime";
import { StockRecieveDetailsDto } from "interfaces/v12/StockRecieve/StockRecieveDetails/StockRecieveDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import EasyCopy from "../../../../components/platbricks/shared/EasyCopy";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

const hidden = true;

export const useStockRecieveTable = () => {
  const { t } = useTranslation("common");
  const { getLocalDate } = useUserDateTime();

  /* eslint-disable react-hooks/exhaustive-deps */
  const StockRecieveData = useMemo<
    DataTableHeaderCell<StockRecieveDetailsDto>[]
  >(
    () => [
      {
        id: "id",
        label: t("stock-receive-id"),
        hidden,
      },
      {
        id: "number",
        label: t("number"),
        render: (row) => (
          <EasyCopy clipboard={row.number}>
            <Link component={NavLink} to={`/stock-receive/${row.id}`}>
              {row.number || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "sellerInfo",
        label: t("seller-info"),
      },
      {
        id: "purchaser",
        label: t("purchaser"),
      },
      {
        id: "warehouseLabel",
        label: t("warehouse"),
        render: (row) => row.warehouseLabel || "-",
      },
      {
        id: "dateOfPurchase",
        label: t("date-of-purchase"),
        render: (row) => getLocalDate(row.dateOfPurchase),
      },
    ],
    [getLocalDate, t]
  );
  /* eslint-enable */
  useCreatedChangeDate(StockRecieveData);
  return [StockRecieveData];
};
