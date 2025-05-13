import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import {
  ClientCodeDetailsDto,
  ClientCodeSearchDto,
} from "interfaces/v12/clientCode/clientCode";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useClientCodeService } from "services/ClientCodeService";
import { useClientCodeTable } from "./datatables/useClientCodeTable";

function ClientCodeListPage() {
  const { t } = useTranslation();

  const [clientCodeTable] = useClientCodeTable();
  const ClientCodeService = useClientCodeService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: ClientCodeSearchDto = {
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
    return ClientCodeService.searchClientCodes(searchOptions)
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
    return ClientCodeService.countClientCodes(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as ClientCodeDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("clientCode")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("clientCode") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-clientCode"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("clientCode")}
        tableKey="ClientCodeListPage"
        headerCells={clientCodeTable}
        data={tableProps}
        dataKey="clientCodeId"
        showSearch={true}
      />
    </Page>
  );
}

export default ClientCodeListPage;
