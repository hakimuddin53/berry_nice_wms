import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import {
  UserDetailsV12Dto,
  UserSearchDto,
} from "interfaces/v12/user/userDetails/UserDetailsV12Dto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUserService } from "services/UserService";
import { useUserTable } from "./datatables/useUserTable";

function UserListPage() {
  const { t } = useTranslation();

  const [userTable] = useUserTable();
  const UserService = useUserService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: UserSearchDto = {
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
    return UserService.searchUsers(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return [];
      });
  };

  const loadDataCount = (
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
    return UserService.countUsers(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as UserDetailsV12Dto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("user")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("user") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-user"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("user")}
        tableKey="UserListPage"
        headerCells={userTable}
        data={tableProps}
        dataKey="userId"
        showSearch={true}
      />
    </Page>
  );
}

export default UserListPage;
