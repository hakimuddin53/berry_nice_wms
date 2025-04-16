import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import {
  UserRoleDetailsDto,
  UserRoleSearchDto,
} from "interfaces/v12/userRole/userRole";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUserRoleService } from "services/UserRoleService";
import { useUserRoleTable } from "./datatables/useUserRoleTable";

function UserRoleListPage() {
  const { t } = useTranslation();

  const [userRoleTable] = useUserRoleTable();
  const UserRoleService = useUserRoleService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: UserRoleSearchDto = {
      search: searchValue,
      page: page + 1,
      pageSize,
    };

    return searchOptions;
  };

  const loadData = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions = getSearchOptions(
      page,
      pageSize,
      searchValue,
      orderBy,
      order
    );
    return UserRoleService.searchUserRoles(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return [];
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as UserRoleDetailsDto[],
    loadData,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("userRole")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("userRole") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-userRole"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("userRole")}
        tableKey="UserRoleListPage-Inbound Deliveries"
        headerCells={userRoleTable}
        data={tableProps}
        dataKey="userRoleId"
        showSearch={true}
      />
    </Page>
  );
}

export default UserRoleListPage;
