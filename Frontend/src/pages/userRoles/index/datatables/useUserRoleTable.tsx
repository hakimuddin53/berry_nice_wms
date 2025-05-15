import { Chip, Link, Typography } from "@mui/material";
import { EasyCopy } from "components/platbricks/shared";
import { UserRoleDetailsDto } from "interfaces/v12/userRole/userRole";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { getModuleName } from "utils/helper";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

export const useUserRoleTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const userRoleData = useMemo<DataTableHeaderCell<UserRoleDetailsDto>[]>(
    () => [
      {
        id: "name",
        label: t("name"),
        render: (row) => (
          <EasyCopy clipboard={row.displayName}>
            <Link component={NavLink} to={`/user-role/${row.id}`}>
              {row.displayName || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
      {
        id: "module",
        label: t("module"),
        render: (row) => (
          <>
            {row.module.map((moduleNumber) => (
              <Chip
                key={moduleNumber}
                label={t(getModuleName(moduleNumber))}
                sx={{ margin: "4px" }}
              />
            ))}
          </>
        ),
      },
      {
        id: "cartonSizeName",
        label: t("cartonSize"),
        render: (row) => (
          <Typography variant="body1" component="div">
            {row.cartonSizeName.map((size, index) => (
              <span key={size}>
                {t(size)}
                {index < row.cartonSizeName.length - 1 && " | "}
              </span>
            ))}
          </Typography>
        ),
      },
    ],
    [t]
  );

  return [userRoleData];
};
