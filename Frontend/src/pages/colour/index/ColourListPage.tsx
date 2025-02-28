import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import {
  ColourDetailsDto,
  ColourSearchDto,
} from "interfaces/v12/colour/colour";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useColourService } from "services/ColourService";
import { useColourTable } from "./datatables/useColourTable";

function ColourListPage() {
  const { t } = useTranslation();

  const [colourTable] = useColourTable();
  const ColourService = useColourService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: ColourSearchDto = {
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
    return ColourService.searchColours(searchOptions)
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
    return ColourService.countColours(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as ColourDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("colour")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("colour") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-colour"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("colour")}
        tableKey="ColourListPage-Inbound Deliveries"
        headerCells={colourTable}
        data={tableProps}
        dataKey="colourId"
        showSearch={true}
      />
    </Page>
  );
}

export default ColourListPage;
