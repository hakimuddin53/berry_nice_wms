import { Link } from "@mui/material";
import { EasyCopy } from "components/platbricks/shared";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { LookupDetailsDto } from "interfaces/v12/lookup/lookup";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useParams } from "react-router-dom";

export const useLookupTable = () => {
  const { t } = useTranslation();
  const { groupKey } = useParams();

  // columns
  const cols = useMemo<DataTableHeaderCell<LookupDetailsDto>[]>(
    () => [
      {
        id: "label",
        label: t("label"),
        render: (row) => (
          <EasyCopy clipboard={row.label}>
            <Link component={NavLink} to={`/lookups/${groupKey}/${row.id}`}>
              {row.label}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "isActive",
        label: t("active"),
        render: (row) => (row.isActive ? t("common:yes") : t("common:no")),
      },
    ],
    [t, groupKey]
  );

  useCreatedChangeDate(cols); // keep same UX as other tables
  return [cols] as const;
};
