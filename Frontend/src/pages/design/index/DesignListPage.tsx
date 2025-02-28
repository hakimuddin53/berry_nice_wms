import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import {
  DesignDetailsDto,
  DesignSearchDto,
} from "interfaces/v12/design/design";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDesignService } from "services/DesignService";
import { useDesignTable } from "./datatables/useDesignTable";

function DesignListPage() {
  const { t } = useTranslation();

  const [designTable] = useDesignTable();
  const DesignService = useDesignService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: DesignSearchDto = {
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
    return DesignService.searchDesigns(searchOptions)
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
    return DesignService.countDesigns(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as DesignDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("design")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("design") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-design"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("design")}
        tableKey="DesignListPage-Inbound Deliveries"
        headerCells={designTable}
        data={tableProps}
        dataKey="designId"
        showSearch={true}
      />
    </Page>
  );
}

export default DesignListPage;
