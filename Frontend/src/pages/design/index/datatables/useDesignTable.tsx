import { Link } from "@mui/material";
import { EasyCopy } from "components/platbricks/shared";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { DesignDetailsDto } from "interfaces/v12/design/design";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

const hidden = true;

export const useDesignTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const designData = useMemo<DataTableHeaderCell<DesignDetailsDto>[]>(
    () => [
      {
        id: "id",
        label: t("design-id"),
      },
      {
        id: "name",
        label: t("name"),
        render: (row) => (
          <EasyCopy clipboard={row.name}>
            <Link component={NavLink} to={`/design/${row.id}`}>
              {row.name || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(designData);

  return [designData];
};
