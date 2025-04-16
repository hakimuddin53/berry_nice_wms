import { Link } from "@mui/material";
import { EasyCopy } from "components/platbricks/shared";
import { UserDetailsV12Dto } from "interfaces/v12/user/userDetails/UserDetailsV12Dto";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

export const useUserTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const userData = useMemo<DataTableHeaderCell<UserDetailsV12Dto>[]>(
    () => [
      {
        id: "id",
        label: t("user-id"),
      },

      {
        id: "email",
        label: t("email"),
        render: (row) => (
          <EasyCopy clipboard={row.email}>
            <Link component={NavLink} to={`/user/${row.id}`}>
              {row.email || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "name",
        label: t("name"),
      },
    ],
    [t]
  );

  return [userData];
};
