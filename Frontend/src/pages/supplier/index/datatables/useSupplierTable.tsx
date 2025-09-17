import { Link } from "@mui/material";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { SupplierDetailsDto } from "interfaces/v12/supplier/supplierDetails/supplierDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import EasyCopy from "../../../../components/platbricks/shared/EasyCopy";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

const hidden = true;

export const useSupplierTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const supplierData = useMemo<DataTableHeaderCell<SupplierDetailsDto>[]>(
    () => [
      {
        id: "id",
        label: t("supplier-id"),
        hidden,
      },
      {
        id: "supplierCode",
        label: t("supplier-code"),
        render: (row) => (
          <EasyCopy clipboard={row.supplierCode}>
            <Link component={NavLink} to={`/supplier/${row.id}`}>
              {row.supplierCode || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "name",
        label: t("common:name"),
      },
      {
        id: "ic",
        label: t("ic"),
      },
      {
        id: "taxId",
        label: t("tax-id"),
      },
      {
        id: "contactNo",
        label: t("contact-no"),
      },
      {
        id: "email",
        label: t("email"),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(supplierData);
  return [supplierData];
};
