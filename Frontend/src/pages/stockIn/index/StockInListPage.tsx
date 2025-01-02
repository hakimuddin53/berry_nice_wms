import { DataTable } from "components/platbricks/shared";
import Page from "components/platbricks/shared/Page";
import { useDatatableControls } from "hooks/useDatatableControls";

import { StockInDetailsDto } from "interfaces/v12/stockin/stockInDetails/stockInDetailsDto";
import { StockInSearchDto } from "interfaces/v12/stockin/stockInSearch/stockInSearchDto";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useStockInService } from "services/StockInService";
import { useStockInTable } from "./datatables/useStockInTable";

function StockInListPage() {
  const { t } = useTranslation();
  const { locationId } = useParams();

  const [stockInTable] = useStockInTable();
  const StockInService = useStockInService();

  const getSearchOptions = (
    page: number,
    pageSize: number,
    searchValue: string,
    orderBy: string,
    order: "asc" | "desc"
  ) => {
    const searchOptions: StockInSearchDto = {
      search: searchValue,
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
    return StockInService.searchStockIns(searchOptions)
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
    return StockInService.countStockIns(searchOptions)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        console.log(err);
        return 0;
      });
  };

  const { tableProps, reloadData } = useDatatableControls({
    initialData: [] as StockInDetailsDto[],
    loadData,
    loadDataCount,
  });

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <Page
      title={t("stock-in")}
      breadcrumbs={[
        { label: t("common:dashboard"), to: "/" },
        { label: t("stock-in") },
      ]}
      hasSingleActionButton
      actions={[{ title: t("new-stock-in"), icon: "Add", to: "new" }]}
    >
      <DataTable
        title={t("stock-in")}
        tableKey="StockInListPage-Inbound Deliveries"
        headerCells={stockInTable}
        data={tableProps}
        dataKey="stockInId"
        showSearch={true}
      />
    </Page>
  );
}

export default StockInListPage;
