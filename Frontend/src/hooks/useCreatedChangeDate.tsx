import PrintIcon from "@mui/icons-material/Print";
import { Link } from "@mui/material";
import UserName from "components/platbricks/entities/UserName";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import i18next from "i18next";
import { NavLink } from "react-router-dom";
import { RemoveExistingCreatedChanged } from "utils/helper";

export const useCreatedChangeDate = (
  columns: DataTableHeaderCell<any>[],
  hidesAll?: boolean,
  type?: string,
  hideCreatedAt?: boolean,
  hideCreatedById?: boolean,
  hideChangedAt?: boolean,
  hideChangedById?: boolean,
  hidePrint?: boolean
) => {
  RemoveExistingCreatedChanged("createdAt", columns);
  RemoveExistingCreatedChanged("createdById", columns);
  RemoveExistingCreatedChanged("changedAt", columns);
  RemoveExistingCreatedChanged("changedById", columns);
  RemoveExistingCreatedChanged("print", columns);

  columns.push(
    {
      id: "createdAt",
      label: i18next.t("common:created-at"),
      render: (row) => <UserDateTime date={row.createdAt} />,
      hidden: (hidesAll ?? false) || (hideCreatedAt ?? false),
    },
    {
      id: "createdById",
      label: i18next.t("common:created-by"),
      render: (row) => <UserName userId={row.createdById} />,
      hidden: (hidesAll ?? false) || (hideCreatedById ?? false),
    },
    {
      id: "changedAt",
      label: i18next.t("common:changed-at"),
      render: (row) => <UserDateTime date={row.changedAt} />,
      hidden: (hidesAll ?? false) || (hideChangedAt ?? false),
    },
    {
      id: "changedById",
      label: i18next.t("common:changed-by"),
      render: (row) => <UserName userId={row.changedById} />,
      hidden: (hidesAll ?? false) || (hideChangedById ?? false),
    },
    {
      id: "print",
      label: "",
      render: (row) => (
        <Link
          component={NavLink}
          to={`/{${type}/${row.id}/print`}
          underline="hover"
          sx={{ display: "inline-flex", alignItems: "center" }}
        >
          <PrintIcon fontSize="small" sx={{ color: "grey.500" }} />
        </Link>
      ),

      hidden: (hidesAll ?? false) || (hidePrint ?? false),
    }
  );

  return [columns];
};
