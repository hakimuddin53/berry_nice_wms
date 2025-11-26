import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { YupInvoiceItemCreateEdit } from "../createEdit/yup/invoiceCreateEditSchema";

const hidden = true;

export const useInvoiceItemTable = () => {
  const { t } = useTranslation();

  const invoiceItemColumns = useMemo<
    DataTableHeaderCell<YupInvoiceItemCreateEdit>[]
  >(
    () => [
      {
        id: "id",
        label: "id",
        hidden,
      },
      {
        id: "productCode",
        label: t("product-code"),
        render: (row) => row.productCode || "-",
      },
      {
        id: "primarySerialNumber",
        label: t("primary-serial-number"),
        render: (row) => row.primarySerialNumber || "-",
      },
      {
        id: "manufactureSerialNumber",
        label: t("manufacture-serial-number"),
        render: (row) => row.manufactureSerialNumber || "-",
      },
      {
        id: "quantity",
        label: t("quantity"),
        render: (row) => row.quantity?.toString() ?? "-",
      },
      {
        id: "unitPrice",
        label: t("unit-price-sold"),
        render: (row) =>
          row.unitPrice !== undefined ? row.unitPrice.toString() : "-",
      },
      {
        id: "totalPrice",
        label: t("total-price"),
        render: (row) =>
          row.totalPrice !== undefined ? row.totalPrice.toString() : "-",
      },
    ],
    [t]
  );

  useCreatedChangeDate(invoiceItemColumns, hidden);

  return [invoiceItemColumns] as const;
};
