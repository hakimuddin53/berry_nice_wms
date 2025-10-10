import { Link } from "@mui/material";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { StockInDetailsDto } from "interfaces/v12/stockIn/stockInDetails/stockInDetailsDto";
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
        label: t("number"),
        render: (row) => (
          <EasyCopy clipboard={row.number}>
            <Link component={NavLink} to={`/stockin/${row.id}`}>
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
        id: "location",
        label: t("location"),
      },
      {
        id: "dateOfPurchase",
        label: t("date-of-purchase"),
        render: (row) => new Date(row.dateOfPurchase).toLocaleDateString(),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(stockInData);
  return [stockInData];
};
