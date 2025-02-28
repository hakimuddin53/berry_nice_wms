import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";

import {
  CartonSizeDetailsDto,
  CartonSizeSearchDto,
} from "interfaces/v12/cartonSize/cartonSize";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCartonSizeService } from "services/CartonSizeService";
import { useCartonSizeTable } from "./datatables/useCartonSizeTable";

function CartonSizeListPage() {
  const { t } = useTranslation();

  const [cartonSizeTable] = useCartonSizeTable();
  const CartonSizeService = useCartonSizeService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: CartonSizeSearchDto = {
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
    return CartonSizeService.searchCartonSizes(searchOptions)
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
    return CartonSizeService.countCartonSizes(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as CartonSizeDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("cartonSize")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("cartonSize") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-cartonSize"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("cartonSize")}
        tableKey="CartonSizeListPage-Inbound Deliveries"
        headerCells={cartonSizeTable}
        data={tableProps}
        dataKey="cartonSizeId"
        showSearch={true}
      />
    </Page>
  );
}

export default CartonSizeListPage;
