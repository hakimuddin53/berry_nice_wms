import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import { SizeDetailsDto, SizeSearchDto } from "interfaces/v12/size/size";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSizeService } from "services/SizeService";
import { useSizeTable } from "./datatables/useSizeTable";

function SizeListPage() {
  const { t } = useTranslation();

  const [sizeTable] = useSizeTable();
  const SizeService = useSizeService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: SizeSearchDto = {
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
    return SizeService.searchSizes(searchOptions)
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
    return SizeService.countSizes(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as SizeDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("size")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("size") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-size"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("size")}
        tableKey="SizeListPage-Inbound Deliveries"
        headerCells={sizeTable}
        data={tableProps}
        dataKey="sizeId"
        showSearch={true}
      />
    </Page>
  );
}

export default SizeListPage;
