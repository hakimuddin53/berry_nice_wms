import { Link } from "@mui/material";
import { EasyCopy } from "components/platbricks/shared";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { WarehouseDetailsDto } from "interfaces/v12/warehouse/warehouse";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

export const useWarehouseTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const warehouseData = useMemo<DataTableHeaderCell<WarehouseDetailsDto>[]>(
    () => [
      {
        id: "id",
        label: t("warehouse-id"),
      },
      {
        id: "name",
        label: t("name"),
        render: (row) => (
          <EasyCopy clipboard={row.name}>
            <Link component={NavLink} to={`/warehouse/${row.id}`}>
              {row.name || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(warehouseData);

  return [warehouseData];
};
