import { Link } from "@mui/material";
import { EasyCopy } from "components/platbricks/shared";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { ClientCodeDetailsDto } from "interfaces/v12/clientCode/clientCode";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

export const useClientCodeTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const clientCodeData = useMemo<DataTableHeaderCell<ClientCodeDetailsDto>[]>(
    () => [
      {
        id: "id",
        label: t("clientCode-id"),
      },
      {
        id: "code",
        label: t("code"),
        render: (row) => (
          <EasyCopy clipboard={row.name}>
            <Link component={NavLink} to={`/client-code/${row.id}`}>
              {row.name || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(clientCodeData);

  return [clientCodeData];
};
