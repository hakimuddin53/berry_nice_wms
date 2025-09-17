import { Link } from "@mui/material";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { CustomerDetailsDto } from "interfaces/v12/customer/customerDetails/customerDetailsDto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import EasyCopy from "../../../../components/platbricks/shared/EasyCopy";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

const hidden = true;

export const useCustomerTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const customerData = useMemo<DataTableHeaderCell<CustomerDetailsDto>[]>(
    () => [
      {
        id: "id",
        label: t("customer-id"),
        hidden,
      },
      {
        id: "customerCode",
        label: t("customer-code"),
        render: (row) => (
          <EasyCopy clipboard={row.customerCode}>
            <Link component={NavLink} to={`/customer/${row.id}`}>
              {row.customerCode || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "name",
        label: t("common:name"),
      },
      {
        id: "phone",
        label: t("phone"),
      },
      {
        id: "email",
        label: t("email"),
      },
      {
        id: "address",
        label: t("address"),
      },
      {
        id: "customerType",
        label: t("customer-type"),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(customerData);
  return [customerData];
};
