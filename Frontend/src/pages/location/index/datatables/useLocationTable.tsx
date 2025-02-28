import { Link } from "@mui/material";
import { EasyCopy } from "components/platbricks/shared";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { LocationDetailsDto } from "interfaces/v12/location/location";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

const hidden = true;

export const useLocationTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const locationData = useMemo<DataTableHeaderCell<LocationDetailsDto>[]>(
    () => [
      {
        id: "id",
        label: t("location-id"),
      },
      {
        id: "name",
        label: t("name"),
        render: (row) => (
          <EasyCopy clipboard={row.name}>
            <Link component={NavLink} to={`/location/${row.id}`}>
              {row.name || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(locationData);

  return [locationData];
};
