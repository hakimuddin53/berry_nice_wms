import PrintIcon from "@mui/icons-material/Print";
import { IconButton, Link, Tooltip } from "@mui/material";
import EasyCopy from "components/platbricks/shared/EasyCopy";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { useUserDateTime } from "hooks/useUserDateTime";
import { InvoiceDetailsDto } from "interfaces/v12/invoice/invoiceDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const hidden = true;

export const useInvoiceTable = (onPrint?: (row: InvoiceDetailsDto) => void) => {
  const { t } = useTranslation();
  const { getLocalDate } = useUserDateTime();
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
        render: (row) => row.customerName || (row as any).customerId || "-",
      },
      {
        id: "dateOfSale",
        label: t("date-of-sale"),
        render: (row) => getLocalDate(row.dateOfSale),
      },
      {
        id: "grandTotal",
        label: t("grand-total"),
        align: "right",
        render: (row) => row.grandTotal.toFixed(2),
      },
    ],
    [getLocalDate, t]
  );
  useCreatedChangeDate(columns);

  if (onPrint) {
    columns.push({
      id: "print",
      label: "",
      render: (row) => (
        <Tooltip title={t("print")}>
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onPrint(row);
            }}
            aria-label={t("print")}
          >
            <PrintIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    });
  }

  return [columns] as const;
};
