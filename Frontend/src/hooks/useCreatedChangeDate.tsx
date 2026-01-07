import UserName from "components/platbricks/entities/UserName";
import UserDateTime from "components/platbricks/shared/UserDateTime";
import { DataTableHeaderCell } from "components/platbricks/shared/dataTable/DataTable";
import i18next from "i18next";
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
      render: (row) => {
        const userId: string | undefined = row.createdById;
        const emptyGuid = "00000000-0000-0000-0000-000000000000";
        if (!userId || userId === emptyGuid) return "-";
        return <UserName userId={userId} />;
      },
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
      render: (row) => {
        const userId: string | undefined = row.changedById;
        const emptyGuid = "00000000-0000-0000-0000-000000000000";
        if (!userId || userId === emptyGuid) return "-";
        return <UserName userId={userId} />;
      },
      hidden: (hidesAll ?? false) || (hideChangedById ?? false),
    }
  );

  return [columns];
};
