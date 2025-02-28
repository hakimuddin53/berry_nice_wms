import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";
import {
  WarehouseDetailsDto,
  WarehouseSearchDto,
} from "interfaces/v12/warehouse/warehouse";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useWarehouseService } from "services/WarehouseService";
import { useWarehouseTable } from "./datatables/useWarehouseTable";

function WarehouseListPage() {
  const { t } = useTranslation();

  const [warehouseTable] = useWarehouseTable();
  const WarehouseService = useWarehouseService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: WarehouseSearchDto = {
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
    return WarehouseService.searchWarehouses(searchOptions)
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
    return WarehouseService.countWarehouses(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as WarehouseDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("warehouse")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("warehouse") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-warehouse"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("warehouse")}
        tableKey="WarehouseListPage-Inbound Deliveries"
        headerCells={warehouseTable}
        data={tableProps}
        dataKey="warehouseId"
        showSearch={true}
      />
    </Page>
  );
}

export default WarehouseListPage;
