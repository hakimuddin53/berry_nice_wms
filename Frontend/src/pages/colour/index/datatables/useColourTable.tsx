import { Link } from "@mui/material";
import { EasyCopy } from "components/platbricks/shared";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { ColourDetailsDto } from "interfaces/v12/colour/colour";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

const hidden = true;

export const useColourTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const colourData = useMemo<DataTableHeaderCell<ColourDetailsDto>[]>(
    () => [
      {
        id: "id",
        label: t("colour-id"),
      },
      {
        id: "name",
        label: t("name"),
        render: (row) => (
          <EasyCopy clipboard={row.name}>
            <Link component={NavLink} to={`/colour/${row.id}`}>
              {row.name || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(colourData);

  return [colourData];
};
