import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { YupInvoiceItemCreateEdit } from "../createEdit/yup/invoiceCreateEditSchema";
import { formatWarrantyExpiry, warrantyLabelFromMonths } from "utils/warranty";

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
        id: "imei",
        label: t("imei", { defaultValue: "IMEI/Serial Number" }),
        render: (row) => row.imei || "-",
      },
      {
        id: "locationName",
        label: t("location"),
        render: (row) => row.locationName || row.locationId || "-",
      },
      {
        id: "unitPrice",
        label: t("unit-price-sold"),
        render: (row) =>
          row.unitPrice !== undefined ? row.unitPrice.toString() : "-",
      },
      {
        id: "warrantyDurationMonths",
        label: t("warranty-duration-months"),
        render: (row) => warrantyLabelFromMonths(row.warrantyDurationMonths),
      },
      {
        id: "warrantyExpiryDate",
        label:
          t("warranty", { defaultValue: "Warranty" }) +
          " " +
          t("expired", { defaultValue: "Expired" }),
        render: (row) => formatWarrantyExpiry(row.warrantyExpiryDate) || "-",
      },
      {
        id: "remark",
        label: t("remark"),
        render: (row) => row.remark || "-",
      },
    ],
    [t]
  );

  useCreatedChangeDate(invoiceItemColumns, hidden);

  return [invoiceItemColumns] as const;
};
