import { Link } from "@mui/material";
import { EasyCopy } from "components/platbricks/shared";
import { useCreatedChangeDate } from "hooks/useCreatedChangeDate";
import { CategoryDetailsDto } from "interfaces/v12/category/category";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { DataTableHeaderCell } from "../../../../components/platbricks/shared/dataTable/DataTable";

const hidden = true;

export const useCategoryTable = () => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  const categoryData = useMemo<DataTableHeaderCell<CategoryDetailsDto>[]>(
    () => [
      {
        id: "id",
        label: t("category-id"),
      },
      {
        id: "name",
        label: t("name"),
        render: (row) => (
          <EasyCopy clipboard={row.name}>
            <Link component={NavLink} to={`/category/${row.id}`}>
              {row.name || "N/A"}
            </Link>
          </EasyCopy>
        ),
      },
    ],
    [t]
  );
  /* eslint-enable */
  useCreatedChangeDate(categoryData);

  return [categoryData];
};
