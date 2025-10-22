import { Link } from "@mui/material";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { InvoiceDetailsDto } from "interfaces/v12/invoice/invoiceDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import EasyCopy from "components/platbricks/shared/EasyCopy";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";

const hidden = true;

export const useInvoiceTable = () => {
  const { t } = useTranslation();
  const columns = useMemo<DataTableHeaderCell<InvoiceDetailsDto>[]>(
    () => [
      {
        id: "id",
        label: "Id",
        hidden,
      },
      {
        id: "number",
        label: t("invoice-number"),
        render: (row) => (
          <EasyCopy clipboard={row.number}>
            <Link component={NavLink} to={`/invoice/${row.id}`}>
              {row.number}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "customerName",
        label: t("customer"),
      },
      {
        id: "dateOfSale",
        label: t("date-of-sale"),
      },
      {
        id: "grandTotal",
        label: t("grand-total"),
        align: "right",
        render: (row) => row.grandTotal.toFixed(2),
      },
    ],
    [t]
  );
  useCreatedChangeDate(columns);

  return [columns] as const;
};
